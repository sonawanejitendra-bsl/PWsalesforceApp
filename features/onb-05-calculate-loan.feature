# User story ONB-5 / SCRUM-10. End to end from sign-in through this story.
Feature: Broker calculates the loan
  The broker signs in, saves the customer and the quote contact, and calculates the loan.
  Instalments are exactly one of 3, 6, 9, 12, or 24.
  Purpose of loan is exactly one of Property Insurance, Life Insurance, or Medical insurance.
  The Examples row is one walkthrough. Another allowed choice still follows this feature.
  Username and password come from PORTAL_USER and PORTAL_PASSWORD in .env.
  The verification code is read from Outlook. It is not stored in this feature.

  Scenario Outline: Broker signs in and calculates the loan
    Given the broker opens the portal
    When the broker chooses Login
    And the broker chooses "Are you an employee? login here"
    And the broker enters the username from PORTAL_USER
    And the broker clicks "Log In"
    Then the password field is shown
    When the broker enters the password from PORTAL_PASSWORD
    And the broker clicks "Log In"
    Then the verification code field is shown
    And Salesforce has emailed a verification code from "noreply@salesforce.com" with subject "Verify your identity in Salesforce"
    When the broker enters the verification code from that email
    And the broker clicks "Verify"
    Then the welcome screen is shown
    And "Start Onboarding" is available

    When the broker clicks "Start Onboarding"
    Then the company search screen is shown
    When the broker searches for "<search>"
    Then the result shows "<company>", number "<companyNumber>", status "<status>", and address "<address>"
    When the broker creates or updates the customer account
    Then the message "Customer Account Created/Updated successfully!" is shown
    And the Company Contacts screen is shown

    When the broker enters email "<email>" for contact "<contact>"
    And the broker marks "<contact>" as the quote contact
    And the broker marks "<contact>" as the authorized signatory
    And the broker creates or updates the contacts
    Then the message "Contacts Created/Updated successfully!" is shown
    And the Loan Information screen is shown

    When the broker enters total premium "<premium>"
    And the broker enters deposit "<depositPercent>" percent
    And the broker enters gross rate "<grossRate>"
    And the broker chooses "<instalments>" instalments
    And the broker chooses purpose "<purpose>"
    And the broker calculates the loan
    Then the calculated loan summary shows total premium "<premium>"
    And the summary shows deposit amount "<depositAmount>"
    And the summary shows credit charge "<creditCharge>"
    And the summary shows monthly instalment "<monthlyInstalment>"
    And the summary shows balance payable excluding deposit "<balancePayable>"

    Examples:
      | search  | company     | companyNumber | status | address                              | contact              | email         | premium | depositPercent | instalments | grossRate | purpose            | depositAmount | creditCharge | monthlyInstalment | balancePayable |
      | Aj Bell | AJ BELL PLC | 04503206      | Active | Exchange Quay, Salford Quays, M5 3EE | BIRCH, Peter Michael | test@test.com | 60000   | 9              | 6           | 9         | Property Insurance | 5400.00       | 4914.00      | 9919.00           | 59514.00       |
