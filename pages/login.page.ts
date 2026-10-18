import type { Page } from "@playwright/test";
import { captureStep } from "../src/capture-step.js";
import { portalPath } from "../src/test-data.js";

/**
 * Salesforce login. The first screen has Username and Log In.
 * The next screen has Password and Log In. Verify Your Identity follows.
 */
export class LoginPage {
  constructor(private readonly page: Page) {}

  private logInButton() {
    return this.page.getByRole("button", { name: /^log\s*in$/i }).first();
  }

  /** Opens PORTAL_PATH from .env. Change the path there, not in this file. */
  async open(): Promise<void> {
    await this.page.goto(portalPath());
    await captureStep(this.page, "Portal opened");
  }

  /** Clicks the Log In button on the current Salesforce login screen. */
  async clickLogin(): Promise<void> {
    await this.logInButton().click();
    await captureStep(this.page, "Login clicked");
  }

  /** PLACEHOLDER. Replace with the real "Are you an employee? login here" control. */
  async clickEmployeeLogin(): Promise<void> {
    await this.page.getByRole("link", { name: /are you an employee/i }).or(this.page.getByRole("button", { name: /are you an employee/i })).first().click();
    await captureStep(this.page, "Employee login clicked");
  }

  /** Username box on the first Salesforce login screen. The value comes from PORTAL_USER. */
  async enterUsername(username: string): Promise<void> {
    const field = this.page.getByRole("textbox", { name: /username/i });
    await field.waitFor({ state: "visible" });
    await field.fill(username);
    await captureStep(this.page, "Username entered");
  }

  /** Log In after the username. The password screen opens next. */
  async clickLoginAfterUsername(): Promise<void> {
    await this.logInButton().click();
    await this.page.getByRole("textbox", { name: /^password$/i }).waitFor({ state: "visible" });
    await captureStep(this.page, "Password requested");
  }

  /** Password box on the second Salesforce login screen. The value comes from PORTAL_PASSWORD. */
  async enterPassword(password: string): Promise<void> {
    const field = this.page.getByRole("textbox", { name: /^password$/i });
    await field.waitFor({ state: "visible" });
    await field.fill(password);
    await captureStep(this.page, "Password entered");
  }

  /** Log In after the password. Verify Your Identity opens next. */
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

  /** Waits for Verify Your Identity and the Verification Code box. */
  async waitForVerificationCode(): Promise<void> {
    await this.verificationCodeField().waitFor({ state: "visible", timeout: 60_000 });
    await captureStep(this.page, "Verification code requested");
  }

  /** Types the code from the Salesforce verification email. */
  async enterVerificationCode(code: string): Promise<void> {
    const field = this.verificationCodeField();
    await field.waitFor({ state: "visible", timeout: 60_000 });
    await field.fill(code);
    await captureStep(this.page, "Verification code entered");
  }

  /** Clicks Verify on Verify Your Identity. */
  async submitVerification(): Promise<void> {
    await this.page.getByRole("button", { name: /^verify$/i }).click();
    await captureStep(this.page, "Verification submitted");
  }
}
