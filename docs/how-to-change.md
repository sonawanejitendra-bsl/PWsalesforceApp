# How to change this project

The framework and the tests are in this one repo. The page object model is already in use. `docs/how-the-flow-runs.md` shows which file runs which step. Three places cover almost every change.

| What you want to change | Where |
| --- | --- |
| Site address | `.env` lines `PORTAL_URL` and `PORTAL_PATH` |
| User and password | `.env` lines `PORTAL_USER` and `PORTAL_PASSWORD` |
| Company, email, premium, rates | `data/onboarding.json` |
| A button or field on a screen | The matching file in `pages/` |
| A new business flow | A new file in `tests/`, plus a page file if the screen is new |

Copy `.env.example` to `.env` once. Git pull does not overwrite `.env`.

## Change the URL

Open `.env`.

- `PORTAL_URL` is the host, for example `https://birlasoftfscdemo-dev-ed.develop.my.site.com`
- `PORTAL_PATH` is the first page, for example `/brokerportal/s/customer-search-portal`

Do not put the path on `PORTAL_URL`. The test opens `PORTAL_URL` + `PORTAL_PATH`.

`playwright.config.ts` reads `PORTAL_URL`. `pages/login.page.ts` method `open()` reads `PORTAL_PATH`.

## Replace a login placeholder

The login screen was not captured. Every login action in `pages/login.page.ts` is marked `PLACEHOLDER`.

1. Open the real login page in the browser.
2. In `pages/login.page.ts`, find the method with that step. The methods follow the flow in order: `clickLogin`, `clickEmployeeLogin`, `enterUsername`, `clickLoginAfterUsername`, `enterPassword`, `submitLogin`.
3. Replace only the locator line inside that method. Leave the method name as it is, so the test file does not need an edit.
4. Put the real username and password in `.env`. Do not type them in the test file.

Example. If the username box has the label `Email`, change `enterUsername` to:

```ts
await this.page.getByRole("textbox", { name: "Email" }).fill(username);
```

## Change the data for this flow

`data/onboarding.json` holds the values the test types and the values it checks.

- `searchText` is what is typed on Company Search.
- `companyName`, `companyNumber`, `status`, and `addressParts` are what the result row must show.
- `contactName` and `email` are the contact row.
- `totalPremium`, `depositPercent`, `repayments`, `grossRate`, and `purpose` are the loan form.

The test reads this file. You do not need to edit `tests/broker-onboarding.spec.ts` to change those values.

## Sign in with the email code

`npm run login` runs only `tests/login-otp.spec.ts`. It stops on the welcome screen. It does not search for a company.

The Salesforce login is two screens, then the code:

1. Enter the username and click **Log In**.
2. Enter the password and click **Log In**.
3. On **Verify Your Identity**, type the code and click **Verify**.

The code comes from the newest Outlook message sent by `noreply@salesforce.com` with the subject **Verify your identity in Salesforce**. The message line is `Verification Code:` followed by the digits. Leave classic Outlook open and signed in. If Outlook asks whether a program may read email, choose Allow.

`OTP_FROM`, `OTP_SUBJECT`, and `OTP_WAIT_SECONDS` in `.env` control that search. `OTP_WAIT_SECONDS` defaults to 90.

## Add a new flow

1. Add `tests/your-flow.spec.ts`.
2. Import `test` from `src/fixtures.ts`.
3. Call the page methods you already have, or add a new class under `pages/`.
4. If you added a page class, register it in `src/fixtures.ts` the same way `loan` is registered.
5. Put typed values and expected text in a new JSON file under `data/`, and load it the same way `loadOnboardingData()` loads `data/onboarding.json`.
6. Add a script in `package.json` if you want a short command, for example `"your-flow": "playwright test tests/your-flow.spec.ts --workers=1"`.

Keep one spec file per flow. Keep locators in `pages/`. Keep expected words and numbers in `data/`.

## Run

```bat
copy .env.example .env
npm install
npx playwright install chromium
npm run onboarding
```

On another PC, clone this repo, then run those same commands. `git pull` later brings code changes. It does not replace your local `.env`.
