import { expect, type Locator, type Page } from "@playwright/test";
import { captureStep } from "../src/capture-step.js";

export class LoanInformationPage {
  constructor(private readonly page: Page) {}

  async expectContactsSaved(): Promise<void> {
    await expect(this.page.getByText("Contacts Created/Updated successfully!")).toBeVisible();
    await expect(this.page.getByRole("heading", { name: "Loan Information" })).toBeVisible();
    await captureStep(this.page, "Contacts saved message");
  }

  private async fillAndLeave(field: Locator, value: string): Promise<void> {
    await field.fill(value);
    await field.press("Tab");
  }

  async enterTotalPremium(amount: string): Promise<void> {
    await this.fillAndLeave(this.page.locator("input[name='loanAmount']"), amount);
    await captureStep(this.page, "Total premium entered");
  }

  async enterDepositPercent(percent: string): Promise<void> {
    await this.fillAndLeave(this.page.locator("input[name='depositPercent']"), percent);
    await captureStep(this.page, "Deposit entered");
  }

  async selectRepayments(count: string): Promise<void> {
    await this.page.getByRole("combobox", { name: /repayment|instalment/i }).click();
    await this.page.getByRole("option", { name: count, exact: true }).click();
    await captureStep(this.page, "Repayments selected");
  }

  async enterGrossRate(rate: string): Promise<void> {
    await this.fillAndLeave(this.page.locator("input[name='grossRate']"), rate);
    await captureStep(this.page, "Gross rate entered");
  }

  async selectPurpose(purpose: string): Promise<void> {
    await this.page.getByRole("combobox", { name: /purpose of loan/i }).click();
    await this.page.getByRole("option", { name: purpose }).click();
    await captureStep(this.page, "Purpose selected");
  }

  async calculate(): Promise<void> {
    await this.page.getByRole("button", { name: "Calculate" }).click();
    await captureStep(this.page, "Calculate clicked");
  }

  async expectLoanSummary(): Promise<void> {
    await expect(this.page.getByText(/loan summary/i)).toBeVisible();
    await expect(this.page.locator(".summary-grid")).toBeVisible();
    await expect(this.page.locator(".summary-grid")).toContainText("Total Premium");
    await expect(this.page.locator(".summary-grid")).toContainText("60000");
    await captureStep(this.page, "Loan summary shown");
  }

  async continue(): Promise<void> {
    await this.page.getByRole("button", { name: "Continue" }).click();
    await captureStep(this.page, "Continue clicked");
  }
}
