import { X, ExternalLink, HelpCircle } from "lucide-react";
import { Button } from "./Button";

interface AppPasswordGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AppPasswordGuideModal({
  isOpen,
  onClose,
}: AppPasswordGuideModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <div className="bg-blue-100 p-2 rounded-full">
              <HelpCircle className="w-5 h-5 text-blue-600" />
            </div>
            <h2 className="text-lg font-semibold text-slate-900">
              How to get an App Password
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          <p className="text-sm text-slate-600">
            To send emails securely through Gmail, you must use an{" "}
            <strong>App Password</strong> instead of your regular login
            password. This is required if you use 2-Step Verification.
          </p>

          <div className="space-y-4">
            <div className="flex gap-3">
              <div className="flex-none flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 text-slate-600 text-xs font-bold border border-slate-200">
                1
              </div>
              <div>
                <h3 className="text-sm font-medium text-slate-900">
                  Enable 2-Step Verification
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  If you haven't already, turn on 2-Step Verification for your
                  Google Account.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex-none flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 text-slate-600 text-xs font-bold border border-slate-200">
                2
              </div>
              <div>
                <h3 className="text-sm font-medium text-slate-900">
                  Go to App Passwords
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Visit your Google Account security settings to create a new
                  app password.
                </p>
                <a
                  href="https://myaccount.google.com/apppasswords"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-blue-600 hover:underline mt-2"
                >
                  Opens Google Account Settings{" "}
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex-none flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 text-slate-600 text-xs font-bold border border-slate-200">
                3
              </div>
              <div>
                <h3 className="text-sm font-medium text-slate-900">
                  Generate Password
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Select <strong>"Mail"</strong> and{" "}
                  <strong>"Windows Computer"</strong> (or "Other"), then
                  clicking "Generate".
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex-none flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 text-slate-600 text-xs font-bold border border-slate-200">
                4
              </div>
              <div>
                <h3 className="text-sm font-medium text-slate-900">
                  Copy & Paste
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Copy the 16-character code (without spaces) and paste it into
                  the <strong>App Password</strong> field in this app.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-50 border-t flex justify-end">
          <Button variant="secondary" onClick={onClose}>
            Got it
          </Button>
        </div>
      </div>
    </div>
  );
}
