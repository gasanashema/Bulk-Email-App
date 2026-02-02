import { useMemo, useState } from "react";
import { useWizard } from "../../context/WizardContext";
import { Button } from "../ui/Button";
import { Card, CardContent } from "../ui/Card";
import { cn } from "../../lib/utils";
import {
  ChevronLeft,
  Download,
  Code,
  Smartphone,
  Monitor,
  AlertTriangle,
  Send,
  Loader2,
  Key,
  Mail,
  Lock,
  HelpCircle,
} from "lucide-react";
import { Input } from "../ui/Input";
import { marked } from "marked";
import { AppPasswordGuideModal } from "../ui/AppPasswordGuideModal";
import { SendingProgress } from "./SendingProgress";
import { useView } from "../../context/ViewContext";

import type { Recipient } from "../../types";

export function PreviewExport() {
  const { endCampaign } = useView();
  const { state, dispatch } = useWizard();
  const [activeRecipientIndex, setActiveRecipientIndex] = useState(0);
  const [viewMode, setViewMode] = useState<"desktop" | "mobile">("desktop");
  const [isSending, setIsSending] = useState(false);
  const [credentials, setCredentials] = useState({ user: "", pass: "" });
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  const activeRecipient = state.recipients[activeRecipientIndex] || {};

  // Generate Email HTML
  const generateEmailHtml = (recipient: Recipient | Record<string, any>) => {
    let content = state.emailContent;

    // Variable Replacement
    Object.keys(recipient).forEach((key) => {
      const regex = new RegExp(`{{${key}}}`, "gi");
      content = content.replace(regex, recipient[key]);
    });

    // Signature
    const signature = state.signatures.find(
      (s) => s.id === state.selectedSignatureId,
    );

    const htmlBody = marked.parse(content);

    // Basic HTML Template
    return `
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>
    body { font-family: sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
    h1, h2, h3 { color: ${state.branding.primaryColor}; }
    a { color: ${state.branding.buttonColor}; }
    .btn { display: inline-block; background: ${state.branding.buttonColor}; color: #fff !important; text-decoration: none; padding: 10px 20px; border-radius: 5px; margin: 10px 0; }
    .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #888; text-align: center; }
    .signature { margin-top: 30px; padding-top: 20px; border-top: 1px dashed #ddd; }
</style>
</head>
<body>
    <div class="content">
        ${htmlBody}
    </div>

    ${
      signature
        ? `
    <div class="signature">
        <p><strong>${signature.fullName}</strong></p>
        ${signature.jobTitle ? `<p>${signature.jobTitle} ${signature.companyName ? "@ " + signature.companyName : ""}</p>` : ""}
        <p style="color: #666; font-size: 0.9em;">
            ${[signature.email, signature.phone, signature.website].filter(Boolean).join(" | ")}
        </p>
    </div>
    `
        : ""
    }

    ${
      state.footer.enabled
        ? `
    <div class="footer">
        <p><strong>${state.footer.companyName}</strong></p>
        <p>${state.footer.address || ""}</p>
        <p>
           ${state.footer.website ? `<a href="${state.footer.website}">Website</a>` : ""} 
           ${state.footer.supportEmail ? ` | <a href="mailto:${state.footer.supportEmail}">Contact Support</a>` : ""}
        </p>
    </div>
    `
        : ""
    }
</body>
</html>
      `;
  };

  const previewHtml = useMemo(() => {
    if (state.recipients.length === 0)
      return "<p>No recipients to preview.</p>";
    return generateEmailHtml(activeRecipient);
  }, [state, activeRecipient]);

  const downloadHtml = () => {
    const blob = new Blob([generateEmailHtml(activeRecipient)], {
      type: "text/html",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `email_preview_${activeRecipient.name || "contact"}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const downloadJson = () => {
    const data = {
      recipients: state.recipients,
      content: state.emailContent,
      subject: state.subject,
      branding: state.branding,
      signature: state.signatures.find(
        (s) => s.id === state.selectedSignatureId,
      ),
      footer: state.footer,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `campaign_export_${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const sendCampaign = async () => {
    if (!state.subject) {
      alert("Please add a subject line first.");
      return;
    }

    if (!credentials.user || !credentials.pass) {
      alert("Please enter your Gmail address and App Password.");
      return;
    }

    if (
      !confirm(
        `Are you sure you want to send emails to ${state.recipients.length} recipients using ${credentials.user}?`,
      )
    ) {
      return;
    }

    setIsSending(true);
  };

  if (isSending) {
    return (
      <div className="h-full flex flex-col items-center justify-center">
        <SendingProgress
          credentials={credentials}
          onComplete={() => {
            setIsSending(false);
            dispatch({ type: "SET_STEP", payload: 1 });
            endCampaign();
          }}
        />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col space-y-6">
      {/* Header Section */}
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Ready to Launch? 🚀
          </h2>
          <p className="text-slate-500 mt-2 font-light">
            Double check your masterpiece before sharing it with the world.
          </p>
        </div>

        <div className="flex items-center bg-white p-1.5 rounded-xl shadow-sm border border-slate-200">
          <button
            onClick={() => setViewMode("desktop")}
            className={cn(
              "p-2.5 rounded-lg transition-all duration-200",
              viewMode === "desktop"
                ? "bg-blue-50 text-blue-600 shadow-sm"
                : "text-slate-400 hover:text-slate-600",
            )}
          >
            <Monitor className="w-5 h-5" />
          </button>
          <button
            onClick={() => setViewMode("mobile")}
            className={cn(
              "p-2.5 rounded-lg transition-all duration-200",
              viewMode === "mobile"
                ? "bg-blue-50 text-blue-600 shadow-sm"
                : "text-slate-400 hover:text-slate-600",
            )}
          >
            <Smartphone className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Validation Warnings */}
      {!state.subject && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center animate-in fade-in slide-in-from-top-2">
          <div className="bg-amber-100 p-2 rounded-full mr-3">
            <AlertTriangle className="text-amber-600 w-5 h-5" />
          </div>
          <div>
            <h4 className="font-semibold text-amber-900">
              Missing Subject Line
            </h4>
            <p className="text-sm text-amber-700">
              Your email needs a catchy subject before you can send it.
            </p>
          </div>
        </div>
      )}

      <div className="flex-1 flex gap-8 overflow-hidden">
        {/* Left Column: Controls */}
        <div className="w-80 flex flex-col gap-6 overflow-y-auto pr-2">
          {/* Credentials Card */}
          <Card className="border-0 shadow-lg ring-1 ring-slate-100 bg-gradient-to-br from-white to-slate-50/50">
            <CardContent className="p-5 space-y-5">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
                  <Lock className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-slate-800">Sender Auth</h3>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider ml-1">
                    Gmail Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                    <Input
                      placeholder="your@gmail.com"
                      value={credentials.user}
                      onChange={(e) =>
                        setCredentials((prev) => ({
                          ...prev,
                          user: e.target.value,
                        }))
                      }
                      className="pl-9 bg-white border-slate-200 focus:border-indigo-500 focus:ring-indigo-500 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between items-center ml-1">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      App Password
                    </label>
                    <button
                      onClick={() => setIsHelpOpen(true)}
                      className="text-[10px] font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1 bg-blue-50 px-2 py-0.5 rounded-full hover:bg-blue-100 transition-colors"
                    >
                      <HelpCircle className="w-3 h-3" /> How to get?
                    </button>
                  </div>
                  <div className="relative">
                    <Key className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                    <Input
                      type="password"
                      placeholder="•••• •••• •••• ••••"
                      value={credentials.pass}
                      onChange={(e) =>
                        setCredentials((prev) => ({
                          ...prev,
                          pass: e.target.value,
                        }))
                      }
                      className="pl-9 bg-white border-slate-200 focus:border-indigo-500 focus:ring-indigo-500 transition-all font-mono text-sm"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <Button
                  className="w-full justify-center h-11 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 font-semibold"
                  onClick={sendCampaign}
                  disabled={isSending}
                >
                  {isSending ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" /> Launch Campaign
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Preview Selector */}
          <Card className="border-slate-100 shadow-sm bg-white">
            <CardContent className="p-5 space-y-3">
              <h3 className="font-bold text-slate-800 text-sm">
                Preview As Recipient
              </h3>
              <div className="space-y-1 max-h-40 overflow-y-auto pr-1">
                {state.recipients.map((r, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveRecipientIndex(i)}
                    className={cn(
                      "w-full text-left px-3 py-2.5 rounded-lg text-sm truncate transition-colors",
                      activeRecipientIndex === i
                        ? "bg-slate-900 text-white font-medium shadow-sm"
                        : "hover:bg-slate-50 text-slate-600",
                    )}
                  >
                    {r.email}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Export Actions */}
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              className="justify-center bg-white hover:bg-slate-50 border-slate-200"
              onClick={downloadHtml}
            >
              <Code className="w-4 h-4 mr-2 text-pink-500" /> HTML
            </Button>
            <Button
              variant="outline"
              className="justify-center bg-white hover:bg-slate-50 border-slate-200"
              onClick={downloadJson}
            >
              <Download className="w-4 h-4 mr-2 text-emerald-500" /> JSON
            </Button>
          </div>
        </div>

        {/* Right Column: Preview Frame */}
        <div className="flex-1 bg-slate-100 rounded-2xl border border-slate-200/60 p-8 flex justify-center overflow-y-auto relative shadow-inner">
          <div className="absolute inset-0 bg-grid-slate-200/50 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] pointer-events-none" />

          <div
            className={cn(
              "bg-white shadow-2xl transition-all duration-500 h-fit min-h-[600px] z-10",
              viewMode === "mobile"
                ? "w-[375px] rounded-[3rem] border-[10px] border-slate-800 ring-1 ring-black/10 overflow-hidden"
                : "w-full max-w-3xl rounded-xl ring-1 ring-slate-900/5",
            )}
          >
            {/* Mobile Notch simulation */}
            {viewMode === "mobile" && (
              <div className="h-6 bg-slate-800 w-1/2 mx-auto rounded-b-xl mb-2" />
            )}

            <div
              className={cn(
                "bg-slate-50 border-b p-4 space-y-1",
                viewMode === "mobile" ? "pt-2" : "",
              )}
            >
              <div className="flex text-xs text-slate-500">
                <span className="w-12 font-medium">To:</span>
                <span className="text-slate-900">{activeRecipient.email}</span>
              </div>
              <div className="flex text-xs text-slate-500">
                <span className="w-12 font-medium">Subject:</span>
                <span className="text-slate-900 font-medium truncate">
                  {state.subject || "(No Subject)"}
                </span>
              </div>
            </div>
            <iframe
              title="Email Preview"
              srcDoc={previewHtml}
              className="w-full h-[600px] border-none bg-white"
              sandbox="allow-same-origin"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-start pt-2">
        <Button
          variant="ghost"
          onClick={() => dispatch({ type: "PREV_STEP" })}
          className="text-slate-500 hover:text-slate-900"
        >
          <ChevronLeft className="w-4 h-4 mr-2" /> Back to Edit
        </Button>
      </div>

      <AppPasswordGuideModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
      />
    </div>
  );
}
