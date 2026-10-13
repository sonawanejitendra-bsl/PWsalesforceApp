# PWsalesforceApp

One repo for the Playwright framework and the broker portal tests.

The onboarding flow is `tests/broker-onboarding.spec.ts`. How to change the URL, replace a login placeholder, or add another flow is in `docs/how-to-change.md`.

## On another computer

```bat
git clone https://github.com/sonawanejitendra-bsl/PWsalesforceApp.git
cd PWsalesforceApp
copy .env.example .env
npm install
npx playwright install chromium
npm run onboarding
```

Fill `PORTAL_USER` and `PORTAL_PASSWORD` in `.env` before a live run. Login locators in `pages/login.page.ts` are still placeholders.

## This flow

1. Open the portal path from `.env`.
2. Sign in.
3. Click **Start Onboarding**.
4. Search the company from `data/onboarding.json` and check the result row.
5. Click **Create or Update Customer Account**.
6. Update the contact, then click **Create or Update Contacts**.
7. Enter the loan values, click **Calculate**, check the loan summary, then click **Continue**.

`HEADED=1` in `.env` shows the browser. In VS Code, choose **Broker onboarding** under Run and Debug. `npm run report` opens the HTML report.
