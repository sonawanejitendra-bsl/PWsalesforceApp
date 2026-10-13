import { expect, type Page } from "@playwright/test";
import { captureStep } from "../src/capture-step.js";

export class CompanySearchPage {
  constructor(private readonly page: Page) {}

  async search(company: string): Promise<void> {
    const companyName = this.page.getByRole("textbox", { name: /company reference number or name/i });
    await companyName.fill(company);
    await companyName.press("Tab");
    await this.page.getByRole("button", { name: "Search", exact: true }).click();
    await captureStep(this.page, "Company searched");
  }

  async expectResult(details: {
    companyName: string;
    companyNumber: string;
    status: string;
    addressParts: string[];
  }): Promise<void> {
    await expect(this.page.getByRole("columnheader", { name: "Company Name" })).toBeVisible();
    await expect(this.page.getByRole("columnheader", { name: "Company Number" })).toBeVisible();
    await expect(this.page.getByRole("columnheader", { name: "Status" })).toBeVisible();
    await expect(this.page.getByRole("columnheader", { name: "Address" })).toBeVisible();

    const row = this.page.getByRole("row", { name: new RegExp(details.companyName, "i") });
    await expect(row).toContainText(details.companyName);
    await expect(row).toContainText(details.companyNumber);
    await expect(row).toContainText(details.status);
    for (const part of details.addressParts) {
      await expect(row).toContainText(part);
    }
    await captureStep(this.page, "Company result shown");
  }

  async createOrUpdateAccount(): Promise<void> {
    await this.page.getByRole("button", { name: "Create or Update Customer Account" }).click();
    await captureStep(this.page, "Create or update account");
  }
}
