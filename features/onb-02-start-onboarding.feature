# User story ONB-2 / SCRUM-7. End to end from sign-in through this story.
Feature: Broker starts onboarding from the welcome screen
  After the email-code sign-in, the broker opens company search.
  The portal address and username are in the steps below.
  The email verification steps are skipped so this scenario can run without that check.

  Scenario: Broker signs in and starts onboarding
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

    When the broker clicks "Start Onboarding"
    Then the company search screen is shown
    And the company search field accepts a company name or a company reference number
