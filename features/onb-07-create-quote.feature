# User story ONB-7 / SCRUM-12. End to end from sign-in through this story.
Feature: Broker reviews the qualification and creates the quote
  The broker signs in, saves the credit information, and creates a quote.
  The quote number in the Examples row is one saved walkthrough. A new run receives a new number.
  The portal address and username are in the steps below.
  The email verification steps are skipped so this scenario can run without that check.

  Scenario Outline: Broker signs in and creates the quote
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
    When the broker searches for "<search>"
    Then the result shows "<company>", status "<status>", and address "<address>"
    When the broker creates or updates the customer account
    Then the message "Customer Account Created/Updated successfully!" is shown
    And the Company Contacts screen is shown

    When the broker enters email "<email>" for contact "<contact>"
    And the broker marks "<contact>" as the quote contact
    And the broker marks "<contact>" as the authorized signatory
    And the broker creates or updates the contacts
    Then the Loan Information screen is shown

    When the broker enters total premium "<premium>"
    And the broker enters deposit "<depositPercent>" percent
    And the broker enters gross rate "<grossRate>"
    And the broker chooses "<instalments>" instalments
    And the broker chooses purpose "<purpose>"
    And the broker calculates the loan
    And the broker continues
    Then the Financial Information screen is shown

    When the broker chooses credit source "<creditSource>"
    And the broker enters credit score "<creditScore>"
    And the broker saves the financial information
    Then the qualification record is shown at stage "Qualification"
    And the stage path shows "Qualification", "Needs Analysis", "Loan Review", "Decision Made", and "Closed"
    And the qualification shows account "<company>", contact "<contact>", purpose "<purpose>", premium "<premium>", and "<instalments>" instalments
    And the qualification shows credit source "<creditSource>" and credit score "<creditScore>"

    When the broker creates a quote
    Then the message "Quote is Created Successfully !!" is shown
    And the qualification lists quote "<quoteNumber>"
    When the broker rests on that quote number
    Then the short summary shows account "<company>", contact "<contact>", and total premium "<premium>"
    When the broker opens that quote
    Then the quote record opens

    Examples:
      | search         | company            | status | address                                           | contact               | email         | premium | depositPercent | instalments | grossRate | purpose            | creditSource | creditScore | quoteNumber |
      | AJC BILLINGHAM | AJC BILLINGHAM LTD | Active | Surtees Business Park, Stockton-On-Tees, TS18 3HR | CAMERON, Andrew David | test@test.com | 60000   | 9              | 6           | 9         | Property Insurance | Experian     | 750         | 00000110    |
