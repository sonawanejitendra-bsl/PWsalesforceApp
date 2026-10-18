import type { Page } from "@playwright/test";
import { captureStep } from "../src/capture-step.js";
import { portalPath } from "../src/test-data.js";

/**
 * Salesforce sign-in used only by tests/login-with-code.spec.ts.
 * The portal Login button matches the working locator in pages/login.page.ts.
 * After that: Username, Log In, Password, Log In, then Verify Your Identity.
 * This file does not change pages/login.page.ts.
 */
export class LoginWithCodePage {
  constructor(private readonly page: Page) {}

  private logInButton() {
    return this.page.getByRole("button", { name: /^log\s*in$/i }).first();
  }

  async open(): Promise<void> {
    await this.page.goto(portalPath());
    await captureStep(this.page, "Portal opened");
  }

  /** Same Login control the onboarding page already uses on the portal header. */
  async clickPortalLogin(): Promise<void> {
    await this.page.locator(".slds-button.slds-button_neutral.comm-user-profile-menu__login-button").click();
    await captureStep(this.page, "Login clicked");
  }

  async enterUsername(username: string): Promise<void> {
    const field = this.page.getByRole("textbox", { name: /username/i });
    await field.waitFor({ state: "visible" });
    await field.fill(username);
    await captureStep(this.page, "Username entered");
  }

  async clickLoginAfterUsername(): Promise<void> {
    await this.logInButton().click();
    await this.page.getByRole("textbox", { name: /^password$/i }).waitFor({ state: "visible" });
    await captureStep(this.page, "Password requested");
  }

  async enterPassword(password: string): Promise<void> {
    const field = this.page.getByRole("textbox", { name: /^password$/i });
    await field.waitFor({ state: "visible" });
    await field.fill(password);
    await captureStep(this.page, "Password entered");
  }

  async submitLogin(): Promise<void> {
    await this.logInButton().click();
    await captureStep(this.page, "Password submitted");
  }

  private verificationCodeField() {
    return this.page
      .getByRole("textbox", { name: /verification code|one-time|passcode|^code$/i })
      .or(this.page.locator("#emc, input[name='emc']"))
      .or(this.page.getByPlaceholder(/code/i))
      .first();
  }

  async waitForVerificationCode(): Promise<void> {
    await this.verificationCodeField().waitFor({ state: "visible", timeout: 60_000 });
    await captureStep(this.page, "Verification code requested");
  }

  async enterVerificationCode(code: string): Promise<void> {
    const field = this.verificationCodeField();
    await field.waitFor({ state: "visible", timeout: 60_000 });
    await field.fill(code);
    await captureStep(this.page, "Verification code entered");
  }

  async submitVerification(): Promise<void> {
    await this.page.getByRole("button", { name: /^verify$/i }).click();
    await captureStep(this.page, "Verification submitted");
  }
}
