import { motion } from "framer-motion";
import {
  ArrowRight,
  ShieldCheck,
  Zap,
  Code,
  HardDrive,
  Share2,
} from "lucide-react";
import { Button } from "../ui/Button";
import { useView } from "../../context/ViewContext";

export function HomePage() {
  const { startWizard } = useView();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900 overflow-hidden relative">
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[30%] -right-[10%] w-[800px] h-[800px] rounded-full bg-blue-100/50 blur-3xl opacity-60" />
        <div className="absolute top-[20%] -left-[10%] w-[600px] h-[600px] rounded-full bg-indigo-100/50 blur-3xl opacity-50" />
      </div>

      {/* Nav */}
      <nav className="relative z-10 w-full max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-2 font-bold text-xl">
          <span className="text-2xl">✉️</span> BucketMail
        </div>
        <a
          href="https://github.com/gasanashema"
          target="_blank"
          rel="noreferrer"
          className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors flex items-center gap-1"
        >
          <Code className="w-4 h-4" /> Open Source
        </a>
      </nav>

      {/* Hero */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-6 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="max-w-4xl mx-auto space-y-8"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-xs font-semibold tracking-wide uppercase mb-4">
            <Zap className="w-3 h-3" /> Local-First Bulk Emailer
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 leading-[1.1]">
            Send Mass Emails <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
              Without the Spyware
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-500 leading-relaxed">
            A powerful, open-source email builder that runs entirely on your
            machine. Your lists, your templates, and your credentials never
            leave your device.
          </p>

          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="pt-4"
          >
            <Button
              onClick={startWizard}
              className="h-14 px-8 text-lg rounded-full bg-slate-900 hover:bg-slate-800 text-white shadow-xl hover:shadow-2xl transition-all"
            >
              Start Campaign <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </motion.div>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="grid md:grid-cols-3 gap-8 mt-24 max-w-5xl mx-auto text-left"
        >
          <FeatureCard
            icon={<ShieldCheck className="w-6 h-6 text-emerald-600" />}
            title="Privacy First"
            desc="We don't track you. Your Google App Password is used directly to connect to Gmail's SMTP servers."
          />
          <FeatureCard
            icon={<HardDrive className="w-6 h-6 text-blue-600" />}
            title="Zero Cloud Storage"
            desc="Everything happens in your browser and local server. No databases, no hidden cloud uploads."
          />
          <FeatureCard
            icon={<Share2 className="w-6 h-6 text-indigo-600" />}
            title="Open Source"
            desc="Transparent code you can trust. Check our repository to see exactly how your data is handled."
          />
        </motion.div>
      </main>

      <footer className="relative z-10 border-t border-slate-100 bg-white/50 backdrop-blur-sm">
        <div className="max-w-full mx-auto px-6 h-16 flex items-center justify-center text-sm text-slate-500">
          <p>
            © {new Date().getFullYear()} BucketMail. Built with privacy in mind
            by{" "}
            <a
              href="https://linktr.ee/Shema_philbert"
              target="_blank"
              rel="noreferrer"
              className="text-slate-900 hover:text-slate-600 transition-colors"
            >
              Shema
            </a>
            .
          </p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
      <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-bold text-slate-900 mb-2">{title}</h3>
      <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
    </div>
  );
}
