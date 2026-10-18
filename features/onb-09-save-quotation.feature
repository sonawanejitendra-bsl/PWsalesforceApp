# User story ONB-9 / SCRUM-14. End to end from sign-in through this story.
Feature: Broker previews the quotation and saves it on the quote
  The broker signs in, saves the commission choice, previews the PDF, and saves it on the quote.
  The quote number and created date in the Examples row are one saved walkthrough.
  Username and password come from PORTAL_USER and PORTAL_PASSWORD in .env.
  The verification code is read from Outlook. It is not stored in this feature.

  Scenario Outline: Broker signs in and saves the quotation PDF
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

    When the broker creates the quotation PDF
    Then the preview is addressed to "<company>" and contact "<contact>"
    And the preview shows address "<address>"
    And the preview shows quote "<quoteNumber>" created on "<createdDate>"
    And the preview shows premium "<premium>", deposit amount "<depositAmount>", gross rate "<grossRate>", and net rate "<netRate>"
    And the preview shows "<instalments>" repayments, monthly instalment "<monthlyInstalment>", credit charge "<creditCharge>", and balance payable excluding deposit "<balancePayable>"
    And the preview shows credit source "<creditSource>" and credit score "<creditScore>"
    And the preview shows broker commission "<commissionAmount>"
    When the broker saves the quotation to the quote
    Then the quotation file is stored on the quote

    Examples:
      | search         | company            | address                                           | contact               | email         | premium | depositPercent | depositAmount | instalments | grossRate | netRate | purpose            | monthlyInstalment | creditCharge | balancePayable | creditSource | creditScore | disclose | commissionAmount | quoteNumber | createdDate |
      | AJC BILLINGHAM | AJC BILLINGHAM LTD | Surtees Business Park, Stockton-On-Tees, TS18 3HR | CAMERON, Andrew David | test@test.com | 60000   | 9              | 5400.00       | 6           | 9.00      | 7       | Property Insurance | 9919.00           | 4914.00      | 59514.00       | Experian     | 750         | Yes      | 1092.00          | 00000110    | 15/10/2026  |
