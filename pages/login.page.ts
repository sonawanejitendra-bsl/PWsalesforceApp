import type { Page } from "@playwright/test";
import { captureStep } from "../src/capture-step.js";
import { portalPath } from "../src/test-data.js";

/**
 * PLACEHOLDER login screen.
 * The live login page was not captured, so these locators are samples.
 * To replace one, change only the locator inside that method.
 * Steps are listed in docs/how-to-change.md.
 */
export class LoginPage {
  constructor(private readonly page: Page) {}

  /** Opens PORTAL_PATH from .env. Change the path there, not in this file. */
  async open(): Promise<void> {
    await this.page.goto(portalPath());
    await captureStep(this.page, "Portal opened");
  }

  /** PLACEHOLDER. Replace with the real Login control. */
  async clickLogin(): Promise<void> {
    await this.page.getByRole("button", { name: /^login$/i }).or(this.page.getByRole("link", { name: /^login$/i })).first().click();
    await captureStep(this.page, "Login clicked");
  }

  /** PLACEHOLDER. Replace with the real "Are you an employee? login here" control. */
  async clickEmployeeLogin(): Promise<void> {
    await this.page.getByRole("link", { name: /are you an employee/i }).or(this.page.getByRole("button", { name: /are you an employee/i })).first().click();
    await captureStep(this.page, "Employee login clicked");
  }

  /** PLACEHOLDER. Replace the username textbox locator. The value comes from PORTAL_USER. */
  async enterUsername(username: string): Promise<void> {
    await this.page.getByRole("textbox", { name: /username/i }).fill(username);
    await captureStep(this.page, "Username entered");
  }

  /** PLACEHOLDER. This is the Login click after the username. */
  async clickLoginAfterUsername(): Promise<void> {
    await this.page.getByRole("button", { name: /^login$/i }).click();
  }

  /** PLACEHOLDER. Replace the password textbox locator. The value comes from PORTAL_PASSWORD. */
  async enterPassword(password: string): Promise<void> {
    await this.page.getByRole("textbox", { name: /password/i }).fill(password);
    await captureStep(this.page, "Password entered");
  }

  /** PLACEHOLDER. This is the Login click after the password. */
  async submitLogin(): Promise<void> {
    await this.page.getByRole("button", { name: /^login$/i }).click();
    await captureStep(this.page, "Logged in");
  }
}
