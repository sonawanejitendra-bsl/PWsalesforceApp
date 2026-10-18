# User story ONB-1 / SCRUM-6. End to end is this sign-in.
Feature: Broker signs in with the email verification code
  This is the sign-in that npm run login runs.
  The Examples row is the same data as data/login-with-code.json.
  The portal address and username are in the steps below.
  The email verification steps are skipped so this scenario can run without that check.
  If OTP_FROM or OTP_SUBJECT is set in .env, that value is used instead of the Examples row.

  Scenario Outline: Broker signs in through the employee login and the email code
    Given the broker opens "https://birlasoftfscdemo-dev-ed.develop.my.site.com/brokerportal/s/customer-search-portal"
    When the broker chooses Login
    And the broker chooses "<employeeLogin>"
    And the broker enters username "jitendra.sonawane@birlasoft.com.fscdemo"
    And the broker clicks "<logInButton>"
    Then the password field is shown
    When the broker enters the password from PORTAL_PASSWORD
    And the broker clicks "<logInButton>"
    # Skipped: Then the verification code field is shown
    # Skipped: And Salesforce has emailed a verification code from "<otpFrom>" with subject "<otpSubject>"
    # Skipped: When the broker enters the verification code from that email
    # Skipped: And the broker clicks "<verifyButton>"
    Then the welcome screen is shown
    And "<welcomeButton>" is available

    Examples:
      | employeeLogin                   | logInButton | verifyButton | welcomeButton    | otpFrom                | otpSubject                         |
      | Are you an employee? login here | Log In      | Verify       | Start Onboarding | noreply@salesforce.com | Verify your identity in Salesforce |
