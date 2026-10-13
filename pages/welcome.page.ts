import type { Page } from "@playwright/test";
import { captureStep } from "../src/capture-step.js";

/** Welcome screen. The onboarding action is the Start Onboarding button. */
export class WelcomePage {
  constructor(private readonly page: Page) {}

  async startOnboarding(): Promise<void> {
    await this.page.getByRole("button", { name: "Start Onboarding" }).click();
    await captureStep(this.page, "Start onboarding");
  }
}
