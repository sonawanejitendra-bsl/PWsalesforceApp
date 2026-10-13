import { expect, type Page } from "@playwright/test";
import { captureStep } from "../src/capture-step.js";

export class CompanyContactsPage {
  constructor(private readonly page: Page) {}

  async expectAccountSaved(): Promise<void> {
    await expect(this.page.getByText("Customer Account Created/Updated successfully!")).toBeVisible();
    await expect(this.page.getByRole("heading", { name: "Company Contacts" })).toBeVisible();
    await captureStep(this.page, "Account saved");
  }

  private contactRow(contactName: string) {
    return this.page.getByRole("row", { name: new RegExp(contactName, "i") });
  }

  async enterEmail(contactName: string, email: string): Promise<void> {
    const emailBox = this.contactRow(contactName).getByPlaceholder("Enter email");
    await emailBox.fill(email);
    await emailBox.press("Tab");
    await captureStep(this.page, "Contact email entered");
  }

  async selectQuoteContact(contactName: string): Promise<void> {
    await this.contactRow(contactName).locator("input[name='isQuoteContact']").check({ force: true });
    await captureStep(this.page, "Quote contact selected");
  }

  async selectAuthorizedSignatory(contactName: string): Promise<void> {
    await this.contactRow(contactName).locator("input[name='isAuthorizedSignatory']").check({ force: true });
    await captureStep(this.page, "Authorized signatory selected");
  }

  async createOrUpdateContacts(): Promise<void> {
    await this.page.getByRole("button", { name: "Create or Update Contacts" }).click();
    await captureStep(this.page, "Contacts saved");
  }
}
