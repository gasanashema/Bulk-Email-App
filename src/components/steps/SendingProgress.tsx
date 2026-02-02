import { useEffect, useState } from "react";
import { useWizard } from "../../context/WizardContext";
import { Card } from "../ui/Card";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { cn } from "../../lib/utils";
import { motion } from "framer-motion";
import { marked } from "marked";
import { useView } from "../../context/ViewContext";
import { Home, PlusCircle } from "lucide-react";

import type { Recipient } from "../../types";
import { API_SEND_URL } from "../../api";

interface SendingStatus {
  [email: string]: "pending" | "sending" | "success" | "error";
}

export function SendingProgress({
  credentials,
  onComplete,
}: {
  credentials: { user: string; pass: string };
  onComplete: (stats: any) => void;
}) {
  const { state } = useWizard();
  const [statusMap, setStatusMap] = useState<SendingStatus>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [stats, setStats] = useState({ sent: 0, failed: 0 });
  const [isFinished, setIsFinished] = useState(false);
  const { goToHome } = useView();
  const { dispatch } = useWizard();

  useEffect(() => {
    // Initialize status
    const initialStatus: SendingStatus = {};
    state.recipients.forEach((r) => (initialStatus[r.email] = "pending"));
    setStatusMap(initialStatus);

    startSending();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const generateEmailHtml = (recipient: Recipient) => {
    // Re-use logic or ideally move this to a helper.
    // For now, simpler to reconstruct or pass down.
    // Assumption: We need to regenerate it here or pass the generator function.
    // Let's assume we can grab the content and do basic replace here for now to avoid huge refactors.
    let content = state.emailContent;
    Object.keys(recipient).forEach((key) => {
      const regex = new RegExp(`{{${key}}}`, "gi");
      // @ts-ignore
      content = content.replace(regex, recipient[key]);
    });

    const signature = state.signatures.find(
      (s) => s.id === state.selectedSignatureId,
    );
    // Using static marked import
    const htmlBody = marked.parse(content);

    return `
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
    body { font-family: sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
    h1, h2, h3 { color: ${state.branding.primaryColor}; }
    a { color: ${state.branding.buttonColor}; }
    .btn { display: inline-block; background: ${state.branding.buttonColor}; color: #fff !important; text-decoration: none; padding: 10px 20px; border-radius: 5px; margin: 10px 0; }
    .footer { margin-top: 40px; border-top: 1px solid ${state.branding.primaryColor}; font-size: 12px; color: #888; text-align: center; }
    .footer strong { color: ${state.branding.primaryColor}; }
    .signature { margin-top: 30px; border-top: 1px dashed #ddd; padding-top: 10px; }
</style>
</head>
<body>
    ${htmlBody}

    ${
      state.branding.ctaEnabled
        ? `
    <div style="text-align: center; margin: 30px 0;">
        <a href="${state.branding.ctaUrl}" class="btn">${state.branding.ctaText}</a>
    </div>
    `
        : ""
    }
    ${
      signature
        ? `
    <div class="signature">
        <p><strong>${signature.fullName}</strong></p>
        ${signature.jobTitle ? `<p>${signature.jobTitle}</p>` : ""}
    </div>`
        : ""
    }
    ${
      state.footer.enabled
        ? `
    <div class="footer">
        <p><strong>${state.footer.companyName}</strong></p>
    </div>`
        : ""
    }
</body>
</html>
         `;
  };

  const startSending = async () => {
    let sentCount = 0;
    let failedCount = 0;

    for (let i = 0; i < state.recipients.length; i++) {
      const recipient = state.recipients[i];
      setCurrentIndex(i);
      setStatusMap((prev) => ({ ...prev, [recipient.email]: "sending" }));

      try {
        const html = generateEmailHtml(recipient);
        const response = await fetch(API_SEND_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            to: recipient.email,
            subject: state.subject,
            html,
            fromName: state.footer.companyName,
            auth: credentials,
          }),
        });

        if (response.ok) {
          setStatusMap((prev) => ({ ...prev, [recipient.email]: "success" }));
          sentCount++;
        } else {
          setStatusMap((prev) => ({ ...prev, [recipient.email]: "error" }));
          failedCount++;
        }
      } catch (e) {
        setStatusMap((prev) => ({ ...prev, [recipient.email]: "error" }));
        failedCount++;
      }

      setStats({ sent: sentCount, failed: failedCount });
      // Artificial delay for better UX visualization
      await new Promise((r) => setTimeout(r, 800));
    }

    setTimeout(() => {
      setIsFinished(true);
      onComplete({ sent: sentCount, failed: failedCount });
    }, 1000);
  };

  const progress = ((currentIndex + 1) / state.recipients.length) * 100;

  return (
    <div className="max-w-2xl mx-auto pt-10">
      <Card className="p-8 space-y-8 bg-white/80 backdrop-blur-md shadow-2xl border-0 ring-1 ring-slate-200/50">
        <div className="text-center space-y-2">
          <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4 relative">
            {isFinished ? (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="bg-green-100 w-full h-full rounded-full flex items-center justify-center"
              >
                <CheckCircle2 className="w-8 h-8 text-green-600" />
              </motion.div>
            ) : (
              <>
                <div className="absolute inset-0 rounded-full border-4 border-blue-500 border-t-transparent animate-spin" />
                <Loader2 className="w-6 h-6 text-blue-600 animate-pulse" />
              </>
            )}
          </div>
          <h2 className="text-2xl font-bold text-slate-900">
            {isFinished ? "Campaign Complete!" : "Sending Campaign..."}
          </h2>
          <p className="text-slate-500">
            {isFinished
              ? "Your messages have been processed."
              : "Do not close this window."}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-semibold uppercase tracking-wider text-slate-500">
            <span>Progress</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-500 to-indigo-600"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ ease: "linear" }}
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="p-4 rounded-xl bg-slate-50">
            <div className="text-2xl font-bold text-slate-900">
              {state.recipients.length}
            </div>
            <div className="text-xs text-slate-500 uppercase tracking-widest font-semibold">
              Total
            </div>
          </div>
          <div className="p-4 rounded-xl bg-green-50 text-green-700">
            <div className="text-2xl font-bold">{stats.sent}</div>
            <div className="text-xs opacity-70 uppercase tracking-widest font-semibold">
              Sent
            </div>
          </div>
          <div className="p-4 rounded-xl bg-red-50 text-red-700">
            <div className="text-2xl font-bold">{stats.failed}</div>
            <div className="text-xs opacity-70 uppercase tracking-widest font-semibold">
              Failed
            </div>
          </div>
        </div>

        {/* List */}
        <div className="max-h-60 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
          {state.recipients.map((r, i) => (
            <div
              key={i}
              className={cn(
                "flex items-center justify-between p-3 rounded-lg border transition-all duration-300",
                statusMap[r.email] === "sending"
                  ? "bg-blue-50 border-blue-100 shadow-sm transform scale-[1.02]"
                  : statusMap[r.email] === "success"
                    ? "bg-white border-green-100"
                    : statusMap[r.email] === "error"
                      ? "bg-white border-red-100"
                      : "bg-slate-50/50 border-transparent opacity-60",
              )}
            >
              <span className="text-sm font-medium text-slate-700">
                {r.email}
              </span>

              {statusMap[r.email] === "pending" && (
                <span className="w-2 h-2 rounded-full bg-slate-300" />
              )}
              {statusMap[r.email] === "sending" && (
                <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
              )}
              {statusMap[r.email] === "success" && (
                <CheckCircle2 className="w-4 h-4 text-green-500" />
              )}
              {statusMap[r.email] === "error" && (
                <XCircle className="w-4 h-4 text-red-500" />
              )}
            </div>
          ))}
        </div>

        {isFinished && (
          <div className="pt-6 grid grid-cols-2 gap-4 animate-in fade-in zoom-in slide-in-from-bottom-4 duration-500">
            <button
              onClick={() => goToHome()}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-white border border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm"
            >
              <Home className="w-4 h-4" /> Go to Home
            </button>
            <button
              onClick={() => dispatch({ type: "RESET" })}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              <PlusCircle className="w-4 h-4" /> New Campaign
            </button>
          </div>
        )}
      </Card>
    </div>
  );
}
