import type { Page } from "@playwright/test";
import { captureStep } from "../src/capture-step.js";

/**
 * Login locators are placeholders. The live login screen was not captured.
 * Replace the role names here when the real login page is available.
 */
export class LoginPage {
  constructor(private readonly page: Page) {}

  async open(): Promise<void> {
    await this.page.goto("/brokerportal/s/customer-search-portal");
    await captureStep(this.page, "Portal opened");
  }

  async clickLogin(): Promise<void> {
    await this.page.getByRole("button", { name: /^login$/i }).or(this.page.getByRole("link", { name: /^login$/i })).first().click();
    await captureStep(this.page, "Login clicked");
  }

  async clickEmployeeLogin(): Promise<void> {
    await this.page.getByRole("link", { name: /are you an employee/i }).or(this.page.getByRole("button", { name: /are you an employee/i })).first().click();
    await captureStep(this.page, "Employee login clicked");
  }

  async enterUsername(username: string): Promise<void> {
    await this.page.getByRole("textbox", { name: /username/i }).fill(username);
    await captureStep(this.page, "Username entered");
  }

  async clickLoginAfterUsername(): Promise<void> {
    await this.page.getByRole("button", { name: /^login$/i }).click();
  }

  async enterPassword(password: string): Promise<void> {
    await this.page.getByRole("textbox", { name: /password/i }).fill(password);
    await captureStep(this.page, "Password entered");
  }

  async submitLogin(): Promise<void> {
    await this.page.getByRole("button", { name: /^login$/i }).click();
    await captureStep(this.page, "Logged in");
  }
}
