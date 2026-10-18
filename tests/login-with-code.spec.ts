// Sign-in with the Salesforce email code. Screen steps live in pages/login.page.ts.
// URL, user, and password stay in .env. Outlook on this machine supplies the code.
import { test } from "../src/fixtures.js";
import { readLatestOutlookOtp } from "../src/outlook-otp.js";
import { loadLoginWithCodeData, portalPassword, portalUser } from "../src/test-data.js";

const data = loadLoginWithCodeData();

test("broker signs in through the email verification code", { tag: "@login" }, async ({ login, welcome }) => {
  test.setTimeout(240_000);

  await test.step("Open the portal and choose employee login", async () => {
    await login.open();
    await login.clickLogin();
    await login.clickEmployeeLogin();
  });

  await test.step("Enter the username and continue", async () => {
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
    const code = await readLatestOutlookOtp(since, { from: data.otpFrom, subject: data.otpSubject });
    await login.enterVerificationCode(code);
    await login.submitVerification();
  });

  await test.step("Welcome screen is shown", async () => {
    await welcome.expectWelcome(data.welcomeButton);
  });
});
