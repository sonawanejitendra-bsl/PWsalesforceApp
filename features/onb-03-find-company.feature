# User story ONB-3 / SCRUM-8. End to end from sign-in through this story.
Feature: Broker finds a company and saves the customer account
  The broker signs in, searches for the company, and creates or updates the customer account.
  The Examples row is one walkthrough. Another company still follows this feature.
  Username and password come from PORTAL_USER and PORTAL_PASSWORD in .env.
  The verification code is read from Outlook. It is not stored in this feature.

  Scenario Outline: Broker signs in and saves the customer account
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

    Examples:
      | search  | company     | companyNumber | status | address                                |
      | Aj Bell | AJ BELL PLC | 04503206      | Active | Exchange Quay, Salford Quays, M5 3EE   |
