# How the onboarding test runs, file by file

This project uses the page object model. The test file lists the steps. Each screen has its own file under `pages/`. Buttons and fields stay in those page files. The words and numbers the test types stay in `data/onboarding.json`.

You can change the company, email, premium, and loan choices in `data/onboarding.json` only. You do not need to edit the test for those values.

## What happens when you run it

You start it with:

```bat
npm run onboarding
```

That command is in `package.json`. It runs one file: `tests/broker-onboarding.spec.ts`.

Playwright then reads `playwright.config.ts`. That file sets the browser, the screenshots, and the site host from `PORTAL_URL` in `.env`.

## The chain for this one test

1. `tests/broker-onboarding.spec.ts` is the flow. It does not contain a button name or a field locator. It calls page methods in order: login, welcome, company search, contacts, loan.
2. `src/fixtures.ts` builds those page objects and hands them to the test as `login`, `welcome`, `companySearch`, `contacts`, and `loan`.
3. `src/test-data.ts` reads `data/onboarding.json` and the user and password from `.env`. The test calls `loadOnboardingData()`, `portalUser()`, and `portalPassword()`.
4. Each method in a `pages/` file does one action on that screen, then `src/capture-step.ts` attaches a screenshot for the report.

| Step in the test | Page file | Method |
| --- | --- | --- |
| Open the portal and sign in | `pages/login.page.ts` | `open`, `clickLogin`, `clickEmployeeLogin`, `enterUsername`, `clickLoginAfterUsername`, `enterPassword`, `submitLogin` |
| Start onboarding | `pages/welcome.page.ts` | `startOnboarding` |
| Search and open the account | `pages/company-search.page.ts` | `search`, `expectResult`, `createOrUpdateAccount` |
| Update the contact | `pages/company-contacts.page.ts` | `expectAccountSaved`, `enterEmail`, `selectQuoteContact`, `selectAuthorizedSignatory`, `createOrUpdateContacts` |
| Calculate the loan | `pages/loan-information.page.ts` | `expectContactsSaved`, `enterTotalPremium`, `enterDepositPercent`, `selectRepayments`, `enterGrossRate`, `selectPurpose`, `calculate`, `expectLoanSummary`, `continue` |

## Where a value comes from

| Value | File | Name in the file |
| --- | --- | --- |
| Site host | `.env` | `PORTAL_URL` |
| First page path | `.env` | `PORTAL_PATH` |
| Username and password | `.env` | `PORTAL_USER`, `PORTAL_PASSWORD` |
| Company typed in search | `data/onboarding.json` | `searchText` |
| Name, number, status, address to check | `data/onboarding.json` | `companyName`, `companyNumber`, `status`, `addressParts` |
| Contact and email | `data/onboarding.json` | `contactName`, `email` |
| Premium, deposit, repayments, rate, purpose | `data/onboarding.json` | `totalPremium`, `depositPercent`, `repayments`, `grossRate`, `purpose` |

Example. To search a different company, change `searchText` and the four result fields in `data/onboarding.json`. The line `companySearch.search(data.searchText)` in the test stays as it is.

## What each kind of file is for

- `tests/` — the business order. One file is one flow.
- `pages/` — the page object for one screen. Locators live only here.
- `src/fixtures.ts` — connects a page class to the name the test uses.
- `src/test-data.ts` — opens the JSON file and reads `.env`.
- `data/` — the numbers and labels for a flow.
- `playwright.config.ts` — browser, timeout, screenshots, and the site host.
- `src/capture-step.ts` — saves the picture after a page action.

Login methods in `pages/login.page.ts` are still placeholders. Replacing a locator is described in `docs/how-to-change.md`. Adding another flow uses the same split: a new spec, a page file if the screen is new, and a JSON file for its data.

`npm run login` is a separate sign-in in `tests/login-with-code.spec.ts` and `pages/login-with-code.page.ts`. It does not change `pages/login.page.ts`. `src/outlook-otp.ts` reads the verification code from classic Outlook on this machine. That command does not run the company search or the loan steps.
