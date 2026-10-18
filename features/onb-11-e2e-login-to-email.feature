# New end-to-end user story. One scenario from sign-in through the quotation email.
# Every value the run needs is written in the steps. No field-visible check before the next action.
Feature: Broker signs in and emails the quotation
  The broker opens the portal, signs in through the employee login, reads the verification code from Outlook, and emails the quotation.

  Scenario: Broker completes onboarding and emails the quotation
    Given the broker opens "https://birlasoftfscdemo-dev-ed.develop.my.site.com/brokerportal/s/customer-search-portal"
    When the broker chooses "Login"
    And the broker chooses "Are you an employee? login here"
    And the broker enters username "jitendra.sonawane@birlasoft.com.fscdemo"
    And the broker clicks "Log In"
    # Replace PORTAL_PASSWORD below with the password from .env before a live run.
    And the broker enters password "PORTAL_PASSWORD"
    And the broker clicks "Log In"
    And the broker opens Outlook on this machine
    And the broker reads the newest message from "noreply@salesforce.com" with subject "Verify your identity in Salesforce"
    And the broker reads the verification code from the line "Verification Code"
    And the broker enters that verification code
    And the broker clicks "Verify"
    And the broker clicks "Start Onboarding"
    And the broker searches for "AJC BILLINGHAM"
    And the broker selects company "AJC BILLINGHAM LTD" with status "Active" and address "Surtees Business Park, Stockton-On-Tees, TS18 3HR"
    And the broker creates or updates the customer account
    And the broker enters email "test@test.com" for contact "CAMERON, Andrew David"
    And the broker marks "CAMERON, Andrew David" as the quote contact
    And the broker marks "CAMERON, Andrew David" as the authorized signatory
    And the broker creates or updates the contacts
    And the broker enters total premium "60000"
    And the broker enters deposit "9" percent
    And the broker enters gross rate "9"
    And the broker chooses "6" instalments
    And the broker chooses purpose "Property Insurance"
    And the broker calculates the loan
    And the broker continues
    And the broker chooses credit source "Experian"
    And the broker enters credit score "750"
    And the broker saves the financial information
    And the broker creates a quote
    And the broker opens that quote
    And the broker sets disclose commission to "Yes"
    And the broker saves the quote
    And the broker creates the quotation PDF
    And the broker clicks "Save and Email Quote"
    And the email is from the signed-in broker
    And the email is addressed to "test@test.com"
    And the quotation file is attached
    And the email is related to this quote
    And the broker confirms the message and sends the email
    Then the quotation is emailed to "test@test.com"
    And the quotation remains on the quote
    And the quotation used premium "60000", deposit amount "5400.00", credit charge "4914.00", monthly instalment "9919.00", balance payable excluding deposit "59514.00", net rate "7", instalments "6", credit source "Experian", credit score "750", commission percent "2.00", and commission amount "1092.00"
