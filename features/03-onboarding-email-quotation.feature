Feature: Broker emails the quotation
  The broker completes onboarding and sends the quotation PDF to the customer.
  The Examples row is one walkthrough. Another company, score, or allowed choice still follows this feature.
  Username and password come from PORTAL_USER and PORTAL_PASSWORD in .env.
  The verification code is read from Outlook. It is not stored in this feature.

  # Allowed choices, for every customer:
  #   Instalments: 3, 6, 9, 12, or 24. Exactly one.
  #   Purpose of loan: Property Insurance, Life Insurance, or Medical insurance. Exactly one.
  #   Credit source: Experian, Equifax, or TransUnion. Exactly one.
  #   Disclose commission: Yes prints the broker commission on the quotation. No leaves it off.

  Scenario Outline: Broker onboards a customer and emails the quotation PDF
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

    When the broker creates a quote
    Then the message "Quote is Created Successfully !!" is shown
    And the qualification lists the new quote number
    When the broker opens that quote
    Then the quote status is Draft
    And the quote shows account "<company>", contact "<contact>", and total premium "<premium>"

    When the broker sets disclose commission to "<disclose>"
    And the broker saves the quote
    Then the broker commission is shown only when disclose commission is Yes

    When the broker creates the quotation PDF
    Then the preview is addressed to "<company>" and contact "<contact>"
    And the preview shows premium "<premium>", "<instalments>" repayments, and credit source "<creditSource>"
    And the preview includes the broker commission only when disclose commission is Yes
    When the broker saves and emails the quotation
    Then the email is from the signed-in broker
    And the email is addressed to "<email>"
    And the quotation file is attached
    And the email is related to the quote
    When the broker confirms and sends the email
    Then the quotation is sent to the customer

    Examples:
      | search         | company            | status | address                                           | contact               | email         | premium | depositPercent | instalments | grossRate | purpose            | creditSource | creditScore | disclose |
      | AJC BILLINGHAM | AJC BILLINGHAM LTD | Active | Surtees Business Park, Stockton-On-Tees, TS18 3HR | CAMERON, Andrew David | test@test.com | 60000   | 9              | 6           | 9         | Property Insurance | Experian     | 750         | Yes      |
