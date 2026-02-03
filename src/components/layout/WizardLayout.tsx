import React from "react";
import { useWizard } from "../../context/WizardContext";
import { cn } from "../../lib/utils";
import {
  Users,
  PenTool,
  FileSignature,
  Palette,
  Eye,
  Github,
  Linkedin,
  Share2,
  Menu,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  // Close mobile menu when step changes
  React.useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [state.currentStep]);

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden">
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-200 flex flex-col transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:flex-shrink-0",
          isMobileMenuOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full",
        )}
      >
        <div
          className="p-6 border-b border-slate-100 cursor-pointer hover:bg-slate-50 transition-colors flex justify-between items-center"
          onClick={goToHome}
        >
          <div>
            <h1 className="text-xl font-bold flex items-center gap-2 text-slate-900">
              <span className="text-2xl">✉️</span> BucketMail
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Secure, local-only bulk emails
            </p>
          </div>
          {/* Close button for mobile */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsMobileMenuOpen(false);
            }}
            className="md:hidden p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          {steps.map((step) => {
            const isActive = state.currentStep === step.id;
            const isCompleted = state.currentStep > step.id;
            const Icon = step.icon;

            return (
              <button
                key={step.id}
                onClick={() => {
                  if (isCompleted) {
                    dispatch({ type: "SET_STEP", payload: step.id });
                    setIsMobileMenuOpen(false);
                  }
                }}
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
      <main className="flex-1 flex flex-col h-full overflow-hidden w-full">
        <header className="h-16 border-b border-slate-200 bg-white/50 backdrop-blur-sm px-4 md:px-8 flex items-center justify-between z-10 shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden p-2 -ml-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg"
            >
              <Menu size={24} />
            </button>
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
              <span className="hidden sm:inline">App Password Help</span>
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8 relative">
          <div className="max-w-5xl mx-auto h-full">{children}</div>
        </div>

        <footer className="border-t border-slate-200/60 bg-white/50 backdrop-blur-sm shrink-0">
          <div className="max-w-full mx-auto px-6 h-12 flex items-center justify-between text-xs text-slate-500">
            <p>
              © {new Date().getFullYear()} BucketMail · Built by{" "}
              <a
                href="https://linktr.ee/Shema_philbert"
                target="_blank"
                rel="noreferrer"
                className="text-slate-900 font-semibold hover:text-blue-600 transition-colors"
              >
                Shema
              </a>
            </p>

            <div className="flex items-center gap-3">
              <a
                href="https://github.com/gasanashema"
                target="_blank"
                rel="noreferrer"
                className="hover:text-slate-900 transition-colors"
              >
                <Github size={14} />
              </a>
              <a
                href="https://www.linkedin.com/in/shema-philbert"
                target="_blank"
                rel="noreferrer"
                className="hover:text-slate-900 transition-colors"
              >
                <Linkedin size={14} />
              </a>
              <a
                href="https://linktr.ee/Shema_philbert"
                target="_blank"
                rel="noreferrer"
                className="hover:text-slate-900 transition-colors"
              >
                <Share2 size={14} />
              </a>
            </div>
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
