# User story ONB-8 / SCRUM-13. End to end from sign-in through this story.
Feature: Broker chooses whether the quotation discloses commission
  The broker signs in, creates the quote, and saves the commission disclosure choice.
  Disclose commission Yes calculates and shows the broker commission. No leaves it off the quotation.
  The Examples row is one walkthrough.
  The portal address and username are in the steps below.
  The verification code is read from Outlook. It is not stored in this feature.

  Scenario Outline: Broker signs in and saves the commission choice
    Given the broker opens "https://birlasoftfscdemo-dev-ed.develop.my.site.com/brokerportal/s/customer-search-portal"
    When the broker chooses Login
    And the broker chooses "Are you an employee? login here"
    And the broker enters username "jitendra.sonawane@birlasoft.com.fscdemo"
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
    Then the message "Quote is Created Successfully !!" is shown
    When the broker opens that quote
    Then the quote status is "Draft"
    And the quote shows account "<company>", contact "<contact>", and total premium "<premium>"

    When the broker sets disclose commission to "<disclose>"
    And the broker saves the quote
    Then the quote shows commission percent "<commissionPercent>" and commission amount "<commissionAmount>"

    Examples:
      | search         | company            | contact               | email         | premium | depositPercent | instalments | grossRate | purpose            | creditSource | creditScore | disclose | commissionPercent | commissionAmount |
      | AJC BILLINGHAM | AJC BILLINGHAM LTD | CAMERON, Andrew David | test@test.com | 60000   | 9              | 6           | 9         | Property Insurance | Experian     | 750         | Yes      | 2.00              | 1092.00          |
