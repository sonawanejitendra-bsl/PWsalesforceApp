import { test as base } from "@playwright/test";
import { CompanyContactsPage } from "../pages/company-contacts.page.js";
import { CompanySearchPage } from "../pages/company-search.page.js";
import { LoanInformationPage } from "../pages/loan-information.page.js";
import { LoginPage } from "../pages/login.page.js";
import { WelcomePage } from "../pages/welcome.page.js";

type Pages = {
  login: LoginPage;
  welcome: WelcomePage;
  companySearch: CompanySearchPage;
  contacts: CompanyContactsPage;
  loan: LoanInformationPage;
};

export const test = base.extend<Pages>({
  login: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  welcome: async ({ page }, use) => {
    await use(new WelcomePage(page));
  },
  companySearch: async ({ page }, use) => {
    await use(new CompanySearchPage(page));
  },
  contacts: async ({ page }, use) => {
    await use(new CompanyContactsPage(page));
  },
  loan: async ({ page }, use) => {
    await use(new LoanInformationPage(page));
  },
});

export { expect } from "@playwright/test";
