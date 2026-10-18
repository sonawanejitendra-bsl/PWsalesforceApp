import { execFile } from "node:child_process";
import path from "node:path";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

/**
 * Reads the newest verification email from classic Outlook on this machine.
 * Only the code is returned. The message body is not written to the test log.
 * Classic Outlook must be installed and signed in. If Outlook asks to allow
 * access, choose Allow for a few minutes.
 */
export async function readLatestOutlookOtp(
  since: Date,
  mail?: { from?: string; subject?: string },
): Promise<string> {
  const waitSeconds = Number(process.env.OTP_WAIT_SECONDS ?? "90");
  const script = path.resolve(process.cwd(), "scripts", "read-outlook-otp.ps1");
  let stdout = "";
  try {
    const result = await execFileAsync(
      "powershell.exe",
      [
        "-NoProfile",
        "-ExecutionPolicy",
        "Bypass",
        "-File",
        script,
        "-Since",
        since.toISOString(),
        "-WaitSeconds",
        String(waitSeconds),
        "-FromLike",
        process.env.OTP_FROM?.trim() || mail?.from?.trim() || "noreply@salesforce.com",
        "-SubjectLike",
        process.env.OTP_SUBJECT?.trim() || mail?.subject?.trim() || "Verify your identity in Salesforce",
      ],
      { timeout: (waitSeconds + 30) * 1000, windowsHide: true },
    );
    stdout = result.stdout;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(
      `Outlook did not return a verification code. Leave classic Outlook open and signed in on this machine. If a prompt asks to allow a program to read email, choose Allow. ${message}`,
    );
  }

  const code = stdout
    .split(/\r?\n/)
    .map((line) => line.trim())
    .find((line) => /^\d{4,8}$/.test(line));
  if (!code) {
    throw new Error(
      "Outlook opened, but no new verification email contained a code. Check the inbox for the login message, or set OTP_FROM / OTP_SUBJECT in .env to narrow the search.",
    );
  }
  return code;
}
