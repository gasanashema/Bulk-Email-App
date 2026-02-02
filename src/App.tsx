import { WizardProvider, useWizard } from "./context/WizardContext";
import { ViewProvider, useView } from "./context/ViewContext";
import { WizardLayout } from "./components/layout/WizardLayout";
import { RecipientUploader } from "./components/steps/RecipientUploader";
import { MarkdownEditor } from "./components/steps/MarkdownEditor";
import { SignatureManager } from "./components/steps/SignatureManager";
import { BrandingManager } from "./components/steps/BrandingManager";
import { PreviewExport } from "./components/steps/PreviewExport";
import { HomePage } from "./components/home/HomePage";

function WizardContent() {
  const { state } = useWizard();

  switch (state.currentStep) {
    case 1:
      return <RecipientUploader />;
    case 2:
      return <MarkdownEditor />;
    case 3:
      return <SignatureManager />;
    case 4:
      return <BrandingManager />;
    case 5:
      return <PreviewExport />;
    default:
      return <RecipientUploader />;
  }
}

function MainApp() {
  const { view } = useView();

  if (view === "home") return <HomePage />;

  return (
    <WizardLayout>
      <WizardContent />
    </WizardLayout>
  );
}

function App() {
  return (
    <ViewProvider>
      <WizardProvider>
        <MainApp />
      </WizardProvider>
    </ViewProvider>
  );
}

export default App;
