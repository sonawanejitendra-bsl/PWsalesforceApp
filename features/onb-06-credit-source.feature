# User story ONB-6 / SCRUM-11. End to end from sign-in through this story.
Feature: Broker records the credit source and credit score
  The broker signs in, calculates the loan, and saves the credit source and score.
  Credit source is exactly one of Experian, Equifax, or TransUnion.
  The Examples row is one walkthrough. Another source or score still follows this feature.
  Username and password come from PORTAL_USER and PORTAL_PASSWORD in .env.
  The verification code is read from Outlook. It is not stored in this feature.

  Scenario Outline: Broker signs in and saves the credit source
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
    Then the result shows "<company>", status "<status>", and address "<address>"
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
    Then the calculated loan summary is shown
    When the broker continues
    Then the Financial Information screen is shown

    When the broker chooses credit source "<creditSource>"
    And the broker enters credit score "<creditScore>"
    And the broker saves the financial information
    Then the qualification record opens
    And the qualification shows credit source "<creditSource>" and credit score "<creditScore>"

    Examples:
      | search         | company            | status | address                                           | contact               | email         | premium | depositPercent | instalments | grossRate | purpose            | creditSource | creditScore |
      | AJC BILLINGHAM | AJC BILLINGHAM LTD | Active | Surtees Business Park, Stockton-On-Tees, TS18 3HR | CAMERON, Andrew David | test@test.com | 60000   | 9              | 6           | 9         | Property Insurance | Experian     | 750         |
