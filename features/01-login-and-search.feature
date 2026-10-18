Feature: Broker signs in and searches for a company
  The broker reaches company search and confirms the matching company.
  The Examples row is one walkthrough. Another company still follows this feature.
  The portal address and username are in the steps below.
  The email verification steps are skipped so this scenario can run without that check.

  Scenario Outline: Broker signs in and finds a company
    Given the broker opens "https://birlasoftfscdemo-dev-ed.develop.my.site.com/brokerportal/s/customer-search-portal"
    When the broker chooses Login
    And the broker chooses "Are you an employee? login here"
    And the broker enters username "jitendra.sonawane@birlasoft.com.fscdemo"
    And the broker clicks "Log In"
    Then the password field is shown
    When the broker enters the password from PORTAL_PASSWORD
    And the broker clicks "Log In"
    # Skipped: Then the verification code field is shown
    # Skipped: And Salesforce has emailed a verification code from "noreply@salesforce.com" with subject "Verify your identity in Salesforce"
    # Skipped: When the broker enters the verification code from that email
    # Skipped: And the broker clicks "Verify"
    Then the welcome screen is shown
    And "Start Onboarding" is available

    When the broker starts onboarding
    Then the company search screen is shown
    When the broker searches for "<search>"
    Then the result shows "<company>", status "<status>", and address "<address>"

    Examples:
      | search         | company            | status | address                                           |
      | AJC BILLINGHAM | AJC BILLINGHAM LTD | Active | Surtees Business Park, Stockton-On-Tees, TS18 3HR |
