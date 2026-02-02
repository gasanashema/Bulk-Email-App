import { motion } from "framer-motion";
import {
  CheckCircle,
  ArrowRight,
  Github,
  Linkedin,
  Home,
  Share2,
} from "lucide-react";
import { Button } from "../ui/Button";
import { useView } from "../../context/ViewContext";
import { useWizard } from "../../context/WizardContext";

export function SuccessPage() {
  const { goToHome, startWizard } = useView();
  const { dispatch } = useWizard();

  const handleStartOver = () => {
    // Reset wizard logic if needed, for now just go to step 1
    dispatch({ type: "SET_STEP", payload: 1 });
    // Ideally we would reset the entire state, but this works for "Another Campaign"
    startWizard();
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-xl w-full bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100"
      >
        <div className="bg-green-500 p-8 text-center text-white">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm"
          >
            <CheckCircle className="w-10 h-10 text-white" />
          </motion.div>
          <h1 className="text-3xl font-bold">Campaign Completed!</h1>
          <p className="text-green-100 mt-2">
            All emails have been processed successfully.
          </p>
        </div>

        <div className="p-8 space-y-8">
          <div className="text-center space-y-6">
            <p className="text-slate-600 leading-relaxed">
              Your bulk email campaign has finished. Remember, no data was
              stored on any external servers. Everything ran locally on your
              machine.
            </p>

            <div className="flex flex-col gap-3">
              <Button
                onClick={handleStartOver}
                className="w-full justify-center h-12 text-lg bg-slate-900 hover:bg-slate-800"
              >
                Start Another Campaign <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button
                variant="outline"
                onClick={goToHome}
                className="w-full justify-center h-12 text-slate-600 border-slate-200"
              >
                <Home className="w-4 h-4 mr-2" /> Back to Home
              </Button>
            </div>
          </div>

          <div className="bg-slate-50 rounded-2xl p-6 text-center space-y-4">
            <h3 className="font-semibold text-slate-900">
              Developed by Shema Philbert
            </h3>
            <div className="flex justify-center gap-4">
              <a
                href="https://github.com/gasanashema"
                target="_blank"
                rel="noreferrer"
                className="p-3 bg-white rounded-full shadow-sm hover:shadow-md hover:text-slate-900 transition-all text-slate-600"
              >
                <Github className="w-6 h-6" />
              </a>
              <a
                href="https://linkedin.com/in/shema-philbert"
                target="_blank"
                rel="noreferrer"
                className="p-3 bg-white rounded-full shadow-sm hover:shadow-md hover:text-blue-700 transition-all text-slate-600"
              >
                <Linkedin className="w-6 h-6" />
              </a>
              <a
                href="https://linktr.ee/Shema_philbert"
                target="_blank"
                rel="noreferrer"
                className="p-3 bg-white rounded-full shadow-sm hover:shadow-md hover:text-green-600 transition-all text-slate-600"
              >
                <Share2 className="w-6 h-6" />
              </a>
            </div>
            <p className="text-xs text-slate-400">
              Follow for more open source tools!
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
