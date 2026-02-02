import React, {
  createContext,
  useContext,
  useReducer,
  type ReactNode,
} from "react";
import type {
  WizardState,
  WizardAction,
  Branding,
  FooterDetails,
} from "../types";

const initialBranding: Branding = {
  primaryColor: "#3b82f6", // blue-500
  buttonColor: "#2563eb", // blue-600
  theme: "modern",
  ctaEnabled: false,
  ctaText: "Learn More",
  ctaUrl: "",
};

const initialFooter: FooterDetails = {
  enabled: true,
  companyName: "",
};

const initialState: WizardState = {
  currentStep: 1,
  recipients: [],
  emailContent: "",
  subject: "",
  signatures: [],
  selectedSignatureId: null,
  branding: initialBranding,
  footer: initialFooter,
};

function wizardReducer(state: WizardState, action: WizardAction): WizardState {
  switch (action.type) {
    case "NEXT_STEP":
      return { ...state, currentStep: Math.min(state.currentStep + 1, 5) };
    case "PREV_STEP":
      return { ...state, currentStep: Math.max(state.currentStep - 1, 1) };
    case "SET_STEP":
      return { ...state, currentStep: action.payload };
    case "SET_RECIPIENTS":
      return { ...state, recipients: action.payload };
    case "UPDATE_EMAIL_CONTENT":
      return { ...state, emailContent: action.payload };
    case "UPDATE_SUBJECT":
      return { ...state, subject: action.payload };
    case "ADD_SIGNATURE":
      return { ...state, signatures: [...state.signatures, action.payload] };
    case "UPDATE_SIGNATURE":
      return {
        ...state,
        signatures: state.signatures.map((sig) =>
          sig.id === action.payload.id ? action.payload : sig,
        ),
      };
    case "SELECT_SIGNATURE":
      return { ...state, selectedSignatureId: action.payload };
    case "UPDATE_BRANDING":
      return { ...state, branding: { ...state.branding, ...action.payload } };
    case "UPDATE_FOOTER":
      return { ...state, footer: { ...state.footer, ...action.payload } };
    default:
      return state;
  }
}

const WizardContext = createContext<
  | {
      state: WizardState;
      dispatch: React.Dispatch<WizardAction>;
    }
  | undefined
>(undefined);

export function WizardProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(wizardReducer, initialState);

  return (
    <WizardContext.Provider value={{ state, dispatch }}>
      {children}
    </WizardContext.Provider>
  );
}

export function useWizard() {
  const context = useContext(WizardContext);
  if (context === undefined) {
    throw new Error("useWizard must be used within a WizardProvider");
  }
  return context;
}
