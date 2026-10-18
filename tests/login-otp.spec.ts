// Separate sign-in flow. After the password, Outlook on this machine supplies the email code.
// The onboarding test does not use this file. URL, user, and password stay in .env.
import { test } from "../src/fixtures.js";
import { readLatestOutlookOtp } from "../src/outlook-otp.js";
import { portalPassword, portalUser } from "../src/test-data.js";

test("broker signs in through the email verification code", { tag: "@login" }, async ({ login, welcome }) => {
  test.setTimeout(240_000);

  await test.step("Enter the username and continue", async () => {
    await login.open();
    await login.enterUsername(portalUser());
    await login.clickLoginAfterUsername();
  });

  await test.step("Enter the password and continue", async () => {
    await login.enterPassword(portalPassword());
  });

  await test.step("Read the Salesforce verification email and enter the code", async () => {
    const since = new Date();
    await login.submitLogin();
    await login.waitForVerificationCode();
    const code = await readLatestOutlookOtp(since);
    await login.enterVerificationCode(code);
    await login.submitVerification();
  });

  await test.step("Welcome screen is shown", async () => {
    await welcome.expectWelcome();
  });
});
