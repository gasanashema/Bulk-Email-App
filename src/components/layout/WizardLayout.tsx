import React from "react";
import { useWizard } from "../../context/WizardContext";
import { cn } from "../../lib/utils";
import { Users, PenTool, FileSignature, Palette, Eye } from "lucide-react";
import { motion } from "framer-motion";
import { AppPasswordGuideModal } from "../ui/AppPasswordGuideModal";

import { useView } from "../../context/ViewContext";

const steps = [
  { id: 1, title: "Recipients", description: "Upload contacts", icon: Users },
  { id: 2, title: "Content", description: "Write email", icon: PenTool },
  {
    id: 3,
    title: "Signature",
    description: "Add details",
    icon: FileSignature,
  },
  { id: 4, title: "Branding", description: "Customize look", icon: Palette },
  { id: 5, title: "Preview", description: "Review & Export", icon: Eye },
];

export function WizardLayout({ children }: { children: React.ReactNode }) {
  const { state, dispatch } = useWizard();
  const { goToHome } = useView();
  const [isHelpOpen, setIsHelpOpen] = React.useState(false);

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900">
      {/* Sidebar */}
      <aside className="w-72 border-r border-slate-200 bg-white flex-shrink-0 flex flex-col">
        <div
          className="p-6 border-b border-slate-100 cursor-pointer hover:bg-slate-50 transition-colors"
          onClick={goToHome}
        >
          <h1 className="text-xl font-bold flex items-center gap-2 text-slate-900">
            <span className="text-2xl">✉️</span> BucketMail
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Secure, local-only bulk emails
          </p>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          {steps.map((step) => {
            const isActive = state.currentStep === step.id;
            const isCompleted = state.currentStep > step.id;
            const Icon = step.icon;

            return (
              <button
                key={step.id}
                onClick={() =>
                  isCompleted &&
                  dispatch({ type: "SET_STEP", payload: step.id })
                }
                disabled={!isCompleted && !isActive}
                className={cn(
                  "w-full flex items-center p-3 rounded-xl transition-all duration-200 text-left group",
                  isActive
                    ? "bg-blue-50 text-blue-700 shadow-sm ring-1 ring-blue-100"
                    : isCompleted
                      ? "text-slate-700 hover:bg-slate-50"
                      : "text-slate-400 opacity-60 cursor-not-allowed",
                )}
              >
                <div
                  className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center mr-3 transition-colors",
                    isActive
                      ? "bg-blue-100 text-blue-600"
                      : "bg-slate-100 text-slate-500",
                  )}
                >
                  <Icon size={20} />
                </div>
                <div>
                  <div className="text-sm font-semibold">{step.title}</div>
                  <div className="text-xs opacity-80">{step.description}</div>
                </div>
                {isCompleted && (
                  <div className="ml-auto text-green-500">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                )}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-100 text-center">
          <p className="text-xs text-slate-400">
            Step {state.currentStep} of {steps.length}
          </p>
          <div className="h-1 w-full bg-slate-100 rounded-full mt-2 overflow-hidden">
            <motion.div
              className="h-full bg-blue-500 rounded-full"
              initial={{ width: 0 }}
              animate={{
                width: `${(state.currentStep / steps.length) * 100}%`,
              }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        <header className="h-16 border-b border-slate-200 bg-white/50 backdrop-blur-sm px-8 flex items-center justify-between z-10">
          <div>
            <h2 className="text-lg font-semibold text-slate-800">
              {steps.find((s) => s.id === state.currentStep)?.title}
            </h2>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setIsHelpOpen(true)}
              className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-blue-600 px-3 py-2 rounded-lg hover:bg-blue-50 transition-colors"
            >
              <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center text-xs font-bold">
                ?
              </span>
              App Password Help
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8 relative">
          <div className="max-w-5xl mx-auto h-full">{children}</div>
        </div>

        <footer className="border-t border-slate-200/60 bg-white/50 backdrop-blur-sm">
          <div className="max-w-full mx-auto px-6 h-12 flex items-center justify-center text-xs text-slate-500">
            <p>
              © {new Date().getFullYear()} BucketMail. Built with privacy in
              mind by{" "}
              <a
                href="https://linktr.ee/Shema_philbert"
                target="_blank"
                rel="noreferrer"
                className="text-slate-900 font-semibold hover:text-blue-600 transition-colors"
              >
                Shema
              </a>
              .
            </p>
          </div>
        </footer>
      </main>

      <AppPasswordGuideModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
      />
    </div>
  );
}
