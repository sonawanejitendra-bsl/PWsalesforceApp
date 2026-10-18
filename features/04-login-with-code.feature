Feature: Broker signs in with the email verification code
  This is the sign-in that npm run login runs.
  The Examples row is the same data as data/login-with-code.json.
  Username and password come from PORTAL_USER and PORTAL_PASSWORD in .env.
  The verification code is read from Outlook on this machine. It is not stored in this feature.
  If OTP_FROM or OTP_SUBJECT is set in .env, that value is used instead of the Examples row.

  Scenario Outline: Broker signs in through the employee login and the email code
    Given the broker opens the portal
    When the broker chooses Login
    And the broker chooses "<employeeLogin>"
    And the broker enters the username from PORTAL_USER
    And the broker clicks "<logInButton>"
    Then the password field is shown
    When the broker enters the password from PORTAL_PASSWORD
    And the broker clicks "<logInButton>"
    Then the verification code field is shown
    And Salesforce has emailed a verification code from "<otpFrom>" with subject "<otpSubject>"
    When the broker enters the verification code from that email
    And the broker clicks "<verifyButton>"
    Then the welcome screen is shown
    And "<welcomeButton>" is available

    Examples:
      | employeeLogin                   | logInButton | verifyButton | welcomeButton    | otpFrom                | otpSubject                         |
      | Are you an employee? login here | Log In      | Verify       | Start Onboarding | noreply@salesforce.com | Verify your identity in Salesforce |
