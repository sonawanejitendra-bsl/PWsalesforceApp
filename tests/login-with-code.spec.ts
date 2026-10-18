// Sign-in with the Salesforce email code. Does not use pages/login.page.ts.
// URL, user, and password stay in .env. Outlook on this machine supplies the code.
import { test } from "../src/fixtures.js";
import { LoginPage } from "../pages/login.page.js";
import { LoginWithCodePage } from "../pages/login-with-code.page.js";
import { readLatestOutlookOtp } from "../src/outlook-otp.js";
import { portalPassword, portalUser } from "../src/test-data.js";

test("broker signs in through the email verification code", { tag: "@login" }, async ({ page, welcome }) => {
  test.setTimeout(240_000);
  const portal = new LoginPage(page);
  const login = new LoginWithCodePage(page);

  await test.step("Open the portal and choose Login", async () => {
    await portal.open();
    await portal.clickLogin();
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
    const code = await readLatestOutlookOtp(since);
    await login.enterVerificationCode(code);
    await login.submitVerification();
  });

  await test.step("Welcome screen is shown", async () => {
    await welcome.expectWelcome();
  });
});
