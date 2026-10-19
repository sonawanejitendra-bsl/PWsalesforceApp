import type { FullResult, Reporter, TestCase, TestResult } from "@playwright/test/reporter";
import { clearHealingEventFile, getHealingEvents } from "../healing/log.js";
import { writeHealReport, type ReportedTest } from "./heal-report.js";

class HealReporter implements Reporter {
  private readonly tests: ReportedTest[] = [];

  onBegin(): void {
    clearHealingEventFile();
  }

  onTestEnd(test: TestCase, result: TestResult): void {
    this.tests.push({
      title: test.title,
      status: result.status,
      durationMs: result.duration,
    });
  }

  onEnd(_result: FullResult): void {
    const file = writeHealReport(this.tests, getHealingEvents());
    console.log(`Heal report: ${file}`);
  }
}

export default HealReporter;
