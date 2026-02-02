import React, {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";

type AppView = "home" | "wizard" | "success";

interface ViewContextType {
  view: AppView;
  setView: (view: AppView) => void;
  goToHome: () => void;
  startWizard: () => void;
  endCampaign: () => void;
}

const ViewContext = createContext<ViewContextType | undefined>(undefined);

export function ViewProvider({ children }: { children: ReactNode }) {
  const [view, setView] = useState<AppView>("home");

  const goToHome = () => setView("home");
  const startWizard = () => setView("wizard");
  const endCampaign = () => setView("success");

  return (
    <ViewContext.Provider
      value={{ view, setView, goToHome, startWizard, endCampaign }}
    >
      {children}
    </ViewContext.Provider>
  );
}

export function useView() {
  const context = useContext(ViewContext);
  if (context === undefined) {
    throw new Error("useView must be used within a ViewProvider");
  }
  return context;
}
