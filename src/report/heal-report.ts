import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import type { HealingEvent } from "../healing/log.js";

export interface ReportedTest {
  title: string;
  status: string;
  durationMs: number;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** One self-contained page for the login run and any healed step. No CDN. */
export function writeHealReport(tests: ReportedTest[], healing: HealingEvent[]): string {
  const passed = tests.filter((item) => item.status === "passed").length;
  const failed = tests.filter((item) => item.status !== "passed" && item.status !== "skipped").length;
  const healed = healing.filter((item) => item.applied).length;
  const rows = tests
    .map(
      (item) => `<tr>
        <td>${escapeHtml(item.title)}</td>
        <td><span class="pill ${item.status === "passed" ? "pass" : "fail"}">${escapeHtml(item.status)}</span></td>
        <td>${Math.round(item.durationMs / 1000)}s</td>
      </tr>`,
    )
    .join("");
  const healRows = healing
    .map((item) => {
      const best = item.suggestions[0];
      return `<tr>
        <td>${escapeHtml(item.intentId)}</td>
        <td><code>${escapeHtml(item.missed ?? "")}</code></td>
        <td>${escapeHtml(best?.match || "—")}</td>
        <td>${best ? `${best.score.toFixed(2)} · ${escapeHtml(best.reason)}` : "—"}</td>
        <td>${item.applied ? "Healed" : "Recorded"}</td>
      </tr>`;
    })
    .join("");
  const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>Broker portal login report</title>
  <style>
    :root { --navy:#14233C; --bg:#F4F7FB; --ink:#1C2B3A; --muted:#5C6B7A; --line:#E2E8F0; --pass:#1B7A4A; --fail:#B42318; }
    body { margin: 0; font-family: Segoe UI, Arial, sans-serif; background: var(--bg); color: var(--ink); }
    header { background: var(--navy); color: #fff; padding: 28px 32px; }
    h1 { margin: 0; font-size: 28px; font-weight: 650; }
    p { margin: 8px 0 0; color: #D5E2EE; }
    main { max-width: 980px; margin: 0 auto; padding: 20px; }
    .kpis { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 14px; }
    .kpi, .panel { background: #fff; border: 1px solid var(--line); border-radius: 12px; }
    .kpi { padding: 14px 16px; }
    .kpi span { display: block; color: var(--muted); font-size: 12px; text-transform: uppercase; letter-spacing: .04em; }
    .kpi b { font-size: 28px; }
    .panel { padding: 16px 18px; margin-bottom: 14px; }
    h2 { margin: 0 0 8px; font-size: 18px; }
    table { width: 100%; border-collapse: collapse; }
    th, td { text-align: left; padding: 10px 8px; border-bottom: 1px solid var(--line); vertical-align: top; font-size: 14px; }
    th { font-size: 11px; text-transform: uppercase; letter-spacing: .04em; color: var(--muted); }
    code { font-family: Consolas, monospace; font-size: 12px; }
    .pill { padding: 2px 8px; border-radius: 99px; font-weight: 700; font-size: 12px; }
    .pass { color: var(--pass); background: #E7F6EE; }
    .fail { color: var(--fail); background: #FDECEC; }
    .note { color: var(--muted); font-size: 14px; }
  </style>
</head>
<body>
  <header>
    <h1>Login and auto-heal</h1>
    <p>Broker portal · rule-based healing, scored on the live page</p>
  </header>
  <main>
    <section class="kpis">
      <div class="kpi"><span>Passed</span><b>${passed}</b></div>
      <div class="kpi"><span>Failed</span><b>${failed}</b></div>
      <div class="kpi"><span>Healed</span><b>${healed}</b></div>
    </section>
    <section class="panel">
      <h2>Tests</h2>
      <table>
        <thead><tr><th>Test</th><th>Status</th><th>Duration</th></tr></thead>
        <tbody>${rows || '<tr><td colspan="3">No tests in this run.</td></tr>'}</tbody>
      </table>
    </section>
    <section class="panel">
      <h2>Self-healing</h2>
      <p class="note">The test looked for a control that was not on the page. Recover mode clicked the highest score when it was at least 0.90 and clearly ahead of the next match. Weights: test id 0.50, role 0.20, name 0.20, label 0.10.</p>
      <table>
        <thead><tr><th>Step</th><th>Looked for</th><th>Clicked</th><th>Score</th><th>Result</th></tr></thead>
        <tbody>${healRows || '<tr><td colspan="5">No healed step in this run.</td></tr>'}</tbody>
      </table>
    </section>
  </main>
</body>
</html>`;
  const dir = path.resolve(process.cwd(), "playwright-report", "dynamic");
  mkdirSync(dir, { recursive: true });
  const file = path.join(dir, "index.html");
  writeFileSync(file, html, "utf8");
  return file;
}
