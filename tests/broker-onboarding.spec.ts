// Flow steps live here. Locators live in pages/. Values live in data/onboarding.json.
// URL, user, and password live in .env. See docs/how-to-change.md.
// Sign-in asks for "Sign in" on purpose, so healing clicks Login. Outlook on this machine supplies the code.
import { test } from "../src/fixtures.js";
import { readLatestOutlookOtp } from "../src/outlook-otp.js";
import { loadLoginWithCodeData, loadOnboardingData, portalPassword, portalUser } from "../src/test-data.js";

const data = loadOnboardingData();
const loginData = loadLoginWithCodeData();

test("broker onboarding end to end", { tag: ["@onboarding", "@heal"] }, async ({ login, welcome, companySearch, contacts, loan }) => {
  test.setTimeout(300_000);

  await test.step("Open the portal and sign in with healing", async () => {
    await login.open();
    await login.clickLoginWithHeal();
    await login.clickEmployeeLogin();
    await login.enterUsername(portalUser());
    await login.clickLoginAfterUsername();
    await login.enterPassword(portalPassword());
  });

  await test.step("Read the Salesforce verification code from Outlook and verify", async () => {
    const since = new Date();
    await login.submitLogin();
    await login.waitForVerificationCode();
    const code = await readLatestOutlookOtp(since, { from: loginData.otpFrom, subject: loginData.otpSubject });
    await login.enterVerificationCode(code);
    await login.submitVerification();
    await welcome.expectWelcome(loginData.welcomeButton);
  });

  await test.step("Start onboarding", async () => {
    await welcome.startOnboarding();
  });

  await test.step("Search for the company and open the account", async () => {
    await companySearch.search(data.searchText);
    await companySearch.expectResult(data);
    await companySearch.createOrUpdateAccount();
  });

  await test.step("Update the first company contact", async () => {
    await contacts.expectAccountSaved();
    await contacts.enterEmail(data.contactName, data.email);
    await contacts.selectQuoteContact(data.contactName);
    await contacts.selectAuthorizedSignatory(data.contactName);
    await contacts.createOrUpdateContacts();
  });

  await test.step("Calculate the loan and continue", async () => {
    await loan.expectContactsSaved();
    await loan.enterTotalPremium(data.totalPremium);
    await loan.enterDepositPercent(data.depositPercent);
    await loan.selectRepayments(data.repayments);
    await loan.enterGrossRate(data.grossRate);
    await loan.selectPurpose(data.purpose);
    await loan.calculate();
    await loan.expectLoanSummary();
    await loan.continue();
  });
});
