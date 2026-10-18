# User story ONB-10 / SCRUM-15. End to end from sign-in through the quotation email.
Feature: Broker emails the quotation to the customer
  The broker signs in, prepares the quotation, and emails it to the customer.
  The Examples row is one walkthrough. Another customer email still follows this feature.
  Username and password come from PORTAL_USER and PORTAL_PASSWORD in .env.
  The verification code is read from Outlook. It is not stored in this feature.

  Scenario Outline: Broker signs in and emails the quotation
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
    And the broker searches for "<search>"
    And the broker creates or updates the customer account
    And the broker enters email "<email>" for contact "<contact>"
    And the broker marks "<contact>" as the quote contact
    And the broker marks "<contact>" as the authorized signatory
    And the broker creates or updates the contacts
    And the broker enters total premium "<premium>"
    And the broker enters deposit "<depositPercent>" percent
    And the broker enters gross rate "<grossRate>"
    And the broker chooses "<instalments>" instalments
    And the broker chooses purpose "<purpose>"
    And the broker calculates the loan
    And the broker continues
    And the broker chooses credit source "<creditSource>"
    And the broker enters credit score "<creditScore>"
    And the broker saves the financial information
    And the broker creates a quote
    And the broker opens that quote
    And the broker sets disclose commission to "<disclose>"
    And the broker saves the quote
    And the broker creates the quotation PDF

    When the broker clicks "Save and Email Quote"
    Then the email window opens for this quote
    And the email is from the signed-in broker
    And the email is addressed to "<email>"
    And the quotation file is attached
    And the email is related to the quote
    When the broker confirms the message and sends the email
    Then the quotation is emailed to the customer
    And the quotation remains on the quote

    Examples:
      | search         | company            | contact               | email         | premium | depositPercent | instalments | grossRate | purpose            | creditSource | creditScore | disclose |
      | AJC BILLINGHAM | AJC BILLINGHAM LTD | CAMERON, Andrew David | test@test.com | 60000   | 9              | 6           | 9         | Property Insurance | Experian     | 750         | Yes      |
