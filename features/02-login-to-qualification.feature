Feature: Broker reaches the qualification record
  The broker signs in, saves the customer and the loan, and stops on the qualification record.
  The quote, the PDF, and the email are a later feature.
  The Examples row is one walkthrough. Another company, score, or allowed choice still follows this feature.
  Username and password come from PORTAL_USER and PORTAL_PASSWORD in .env.
  The verification code is read from Outlook. It is not stored in this feature.

  # Allowed choices, for every customer:
  #   Instalments: 3, 6, 9, 12, or 24. Exactly one.
  #   Purpose of loan: Property Insurance, Life Insurance, or Medical insurance. Exactly one.
  #   Credit source: Experian, Equifax, or TransUnion. Exactly one.

  Scenario Outline: Broker signs in and opens the qualification record
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
    Then the calculated loan summary shows total premium "<premium>"
    And the summary shows the deposit amount, credit charge, monthly instalment, and balance payable excluding deposit
    When the broker continues
    Then the Financial Information screen is shown

    When the broker chooses credit source "<creditSource>"
    And the broker enters credit score "<creditScore>"
    And the broker saves the financial information
    Then the qualification record is shown at stage Qualification
    And the qualification shows account "<company>", contact "<contact>", premium "<premium>", "<instalments>" instalments, and credit source "<creditSource>"

    Examples:
      | search         | company            | status | address                                           | contact               | email         | premium | depositPercent | instalments | grossRate | purpose            | creditSource | creditScore |
      | AJC BILLINGHAM | AJC BILLINGHAM LTD | Active | Surtees Business Park, Stockton-On-Tees, TS18 3HR | CAMERON, Andrew David | test@test.com | 60000   | 9              | 6           | 9         | Property Insurance | Experian     | 750         |
