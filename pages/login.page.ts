import type { Page } from "@playwright/test";
import { captureStep } from "../src/capture-step.js";
import { healedClick, portalLoginIntent } from "../src/healing/engine.js";
import { portalPath } from "../src/test-data.js";

/**
 * Portal login and the Salesforce username, password, and email-code screens.
 * To replace one control, change only the locator inside that method.
 * Steps are listed in docs/how-to-change.md.
 */
export class LoginPage {
  constructor(private readonly page: Page) {}

  /** Opens PORTAL_PATH from .env. Change the path there, not in this file. */
  async open(): Promise<void> {
    await this.page.goto(portalPath());
    await captureStep(this.page, "Portal opened");
  }

  /** Portal header Login. Opens the Salesforce username screen. */
  async clickLogin(): Promise<void> {
    await this.page.locator(".slds-button.slds-button_neutral.comm-user-profile-menu__login-button").click();
    await captureStep(this.page, "Login clicked");
  }

  /**
   * Asks for "Sign in" on purpose. The live control is named Login, so the probe misses.
   * Healing then scores the page and clicks Login.
   */
  async clickLoginWithHeal(): Promise<void> {
    const stale = this.page.getByRole("button", { name: "Sign in" });
    await healedClick(this.page, stale, portalLoginIntent);
    await captureStep(this.page, "Login clicked by healing");
  }

  /** "Are you an employee? login here" on the Salesforce screen, before the username. */
  async clickEmployeeLogin(): Promise<void> {
    const employee = this.page
      .getByRole("link", { name: /are you an employee|log\s*in here/i })
      .or(this.page.getByRole("button", { name: /are you an employee|log\s*in here/i }))
      .or(this.page.getByText(/are you an employee/i))
      .first();
    await employee.waitFor({ state: "visible" });
    await employee.click();
    await this.page.getByRole("textbox", { name: /username/i }).waitFor({ state: "visible" });
    await captureStep(this.page, "Employee login clicked");
  }

  /** PLACEHOLDER. Replace the username textbox locator. The value comes from PORTAL_USER. */
  async enterUsername(username: string): Promise<void> {
    await this.page.getByRole("textbox", { name: /username/i }).fill(username);
    await captureStep(this.page, "Username entered");
  }

  /** Salesforce Log In on the username screen. */
  async clickLoginAfterUsername(): Promise<void> {
    await this.page.locator('input.button.r4.wide.primary[type="submit"]#Login[name="Login"]').click();
  }

  /** PLACEHOLDER. Replace the password textbox locator. The value comes from PORTAL_PASSWORD. */
  async enterPassword(password: string): Promise<void> {
    await this.page.getByRole("textbox", { name: /password/i }).fill(password);
    await captureStep(this.page, "Password entered");
  }

  /** Salesforce Log In on the password screen. */
  async submitLogin(): Promise<void> {
    await this.page.locator('input.button.r4.wide.primary[type="submit"]#Login[name="Login"]').click();
    await captureStep(this.page, "Logged in");
  }

  private verificationCodeField() {
    return this.page
      .getByRole("textbox", { name: /verification code|one-time|passcode|^code$/i })
      .or(this.page.locator("#emc, input[name='emc']"))
      .or(this.page.getByPlaceholder(/code/i))
      .first();
  }

  /** Shown after the password, when Salesforce emails a verification code. */
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
