# PWsalesforceApp

One repo for the Playwright framework and the broker portal tests.

The onboarding flow is `tests/broker-onboarding.spec.ts`. It uses the page object model: steps in `tests/`, locators in `pages/`, and values in `data/onboarding.json`.

`docs/how-the-flow-runs.md` follows that test from file to file. `docs/how-to-change.md` covers the URL, login placeholders, and a new flow.

## On another computer

```bat
git clone https://github.com/sonawanejitendra-bsl/PWsalesforceApp.git
cd PWsalesforceApp
copy .env.example .env
npm install
npx playwright install chromium
npm run onboarding
```

Fill `PORTAL_USER` and `PORTAL_PASSWORD` in `.env` before a live run. Keep classic Outlook open and signed in, because the run reads the verification code from it.

## This flow

1. Open the portal path from `.env`.
2. Click **Sign in**. The portal button is named **Login**, so that click misses and self-healing clicks **Login** instead.
3. Choose the employee login, enter the username and password, read the Salesforce verification code from classic Outlook on this machine, and click **Verify**.
4. Click **Start Onboarding**.
5. Search the company from `data/onboarding.json` and check the result row.
6. Click **Create or Update Customer Account**.
7. Update the contact, then click **Create or Update Contacts**.
8. Enter the loan values, click **Calculate**, check the loan summary, then click **Continue**.

`HEADED=1` in `.env` shows the browser. In VS Code, choose **Broker onboarding** under Run and Debug. `npm run report` opens the execution summary (`playwright-report\dynamic`): pass rate, quality gates, each step with its screenshot, self-healing detail, and the last 10 runs. `npm run report:playwright` opens Playwright's own HTML report.
