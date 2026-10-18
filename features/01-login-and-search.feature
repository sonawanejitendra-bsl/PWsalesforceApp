Feature: Broker signs in and searches for a company
  The broker reaches company search and confirms the matching company.
  The Examples row is one walkthrough. Another company still follows this feature.
  Username and password come from PORTAL_USER and PORTAL_PASSWORD in .env.
  The verification code is read from Outlook. It is not stored in this feature.

  Scenario Outline: Broker signs in and finds a company
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

    When the broker starts onboarding
    Then the company search screen is shown
    When the broker searches for "<search>"
    Then the result shows "<company>", status "<status>", and address "<address>"

    Examples:
      | search         | company            | status | address                                           |
      | AJC BILLINGHAM | AJC BILLINGHAM LTD | Active | Surtees Business Park, Stockton-On-Tees, TS18 3HR |
