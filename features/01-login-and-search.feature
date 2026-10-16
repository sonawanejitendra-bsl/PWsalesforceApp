Feature: Broker signs in and searches for a company
  The broker reaches company search and confirms the matching company.
  The Examples row is one walkthrough. Another company still follows this feature.
  Replace username and password with the portal user before a run.

  Scenario Outline: Broker signs in and finds a company
    Given the broker opens the portal
    When the broker chooses Login
    And the broker chooses the employee login
    And the broker enters username "<username>"
    And the broker enters password "<password>"
    And the broker submits the login
    Then the welcome screen is shown

    When the broker starts onboarding
    Then the company search screen is shown
    When the broker searches for "<search>"
    Then the result shows "<company>", status "<status>", and address "<address>"

    Examples:
      | username | password | search         | company            | status | address                                           |
      | broker   | secret   | AJC BILLINGHAM | AJC BILLINGHAM LTD | Active | Surtees Business Park, Stockton-On-Tees, TS18 3HR |
