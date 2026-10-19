// Same sign-in as tests/login-with-code.spec.ts.
// The portal Login button is requested with a stale locator so healing must find it.
import { test } from "../src/fixtures.js";
import { readLatestOutlookOtp } from "../src/outlook-otp.js";
import { loadLoginWithCodeData, portalPassword, portalUser } from "../src/test-data.js";

const data = loadLoginWithCodeData();

test("broker signs in when the Login locator is healed", { tag: ["@login", "@heal"] }, async ({ login, welcome }) => {
  test.setTimeout(240_000);

  await test.step("Open the portal and heal the Login click", async () => {
    await login.open();
    await login.clickLoginWithHeal();
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
