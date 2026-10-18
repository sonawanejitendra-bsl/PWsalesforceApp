import { readFileSync } from "node:fs";
import path from "node:path";

export interface OnboardingData {
  searchText: string;
  companyName: string;
  companyNumber: string;
  status: string;
  addressParts: string[];
  contactName: string;
  email: string;
  totalPremium: string;
  depositPercent: string;
  repayments: string;
  grossRate: string;
  purpose: string;
}

export function loadOnboardingData(): OnboardingData {
  const file = path.resolve(process.cwd(), "data", "onboarding.json");
  return JSON.parse(readFileSync(file, "utf8")) as OnboardingData;
}

/** Site host. Change PORTAL_URL in .env. Do not put a path here. */
export function portalUrl(): string {
  return process.env.PORTAL_URL ?? "https://birlasoftfscdemo-dev-ed.develop.my.site.com";
}

/** Page path after the host. Change PORTAL_PATH in .env. */
export function portalPath(): string {
  return process.env.PORTAL_PATH ?? "/brokerportal/s/customer-search-portal";
}

export function portalUser(): string {
  return process.env.PORTAL_USER ?? "";
}

export function portalPassword(): string {
  return process.env.PORTAL_PASSWORD ?? "";
}

export interface LoginWithCodeData {
  employeeLogin: string;
  logInButton: string;
  verifyButton: string;
  welcomeButton: string;
  otpFrom: string;
  otpSubject: string;
}

/** Screen labels and the verification email match for npm run login. */
export function loadLoginWithCodeData(): LoginWithCodeData {
  const file = path.resolve(process.cwd(), "data", "login-with-code.json");
  return JSON.parse(readFileSync(file, "utf8")) as LoginWithCodeData;
}
