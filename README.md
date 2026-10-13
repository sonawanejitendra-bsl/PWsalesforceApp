# PWsalesforceApp

One repo for the Playwright framework and the broker portal tests. There is no separate framework package.

## Flow

`tests/broker-onboarding.spec.ts` runs the onboarding path:

1. Open the customer search portal.
2. Sign in. The login locators are placeholders until that screen is captured. Set `PORTAL_USER` and `PORTAL_PASSWORD` in `.env`.
3. Click **Start Onboarding**.
4. Search `Aj Bell` and check the result row: company name, company number, status, and address.
5. Click **Create or Update Customer Account**.
6. On Company Contacts, check the green success message, enter `test@test.com` for Birch, Peter Michael, tick Quote Contact and Authorized Signatory, then click **Create or Update Contacts**.
7. On Loan Information, check the green success message, enter premium `60000`, deposit `7`, repayments `9`, gross rate `9`, and purpose `Property Insurance`.
8. Click **Calculate**, check the loan summary, then click **Continue**.

Screen values that the test checks live in `data/onboarding.json`.

## Run

```bat
copy .env.example .env
npm install
npx playwright install chromium
npm run onboarding
```

In VS Code, open this folder, choose **Broker onboarding** under Run and Debug, and press the green play button.

`HEADED=1` in `.env` shows the browser. `npm run report` opens the HTML report. Each step also attaches a screenshot.
