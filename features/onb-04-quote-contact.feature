# User story ONB-4 / SCRUM-9. End to end from sign-in through this story.
Feature: Broker sets the quote contact and authorized signatory
  The broker signs in, saves the customer account, and saves the quote contact.
  The Examples row is one walkthrough. Another contact still follows this feature.
  The portal address and username are in the steps below.
  The verification code is read from Outlook. It is not stored in this feature.

  Scenario Outline: Broker signs in and saves the quote contact
    Given the broker opens "https://birlasoftfscdemo-dev-ed.develop.my.site.com/brokerportal/s/customer-search-portal"
    When the broker chooses Login
    And the broker chooses "Are you an employee? login here"
    And the broker enters username "jitendra.sonawane@birlasoft.com.fscdemo"
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

    Examples:
      | search  | company     | companyNumber | status | address                              | contact              | email         |
      | Aj Bell | AJ BELL PLC | 04503206      | Active | Exchange Quay, Salford Quays, M5 3EE | BIRCH, Peter Michael | test@test.com |
