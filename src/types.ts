export interface Recipient {
  id: string;
  email: string;
  name: string;
  [key: string]: string;
}

export interface Signature {
  id: string;
  name: string;
  fullName: string;
  jobTitle?: string;
  companyName?: string;
  email?: string;
  phone?: string;
  website?: string;
  socialLinks?: { platform: string; url: string }[];
}

export interface Branding {
  primaryColor: string;
  buttonColor: string;
  logoUrl?: string;
  theme: "minimal" | "corporate" | "modern";
  ctaEnabled: boolean;
  ctaText: string;
  ctaUrl: string;
}

export interface FooterDetails {
  enabled: boolean;
  companyName: string;
  address?: string;
  phone?: string;
  supportEmail?: string;
  website?: string;
}

export interface WizardState {
  currentStep: number;
  recipients: Recipient[];
  emailContent: string;
  signatures: Signature[];
  selectedSignatureId: string | null;
  branding: Branding;
  footer: FooterDetails;
  subject: string;
}

export type WizardAction =
  | { type: "NEXT_STEP" }
  | { type: "PREV_STEP" }
  | { type: "SET_STEP"; payload: number }
  | { type: "SET_RECIPIENTS"; payload: Recipient[] }
  | { type: "UPDATE_EMAIL_CONTENT"; payload: string }
  | { type: "UPDATE_SUBJECT"; payload: string }
  | { type: "ADD_SIGNATURE"; payload: Signature }
  | { type: "UPDATE_SIGNATURE"; payload: Signature }
  | { type: "SELECT_SIGNATURE"; payload: string | null }
  | { type: "UPDATE_BRANDING"; payload: Partial<Branding> }
  | { type: "UPDATE_FOOTER"; payload: Partial<FooterDetails> }
  | { type: "RESET" };
