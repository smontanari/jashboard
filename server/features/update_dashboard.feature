Feature: Update dashboard details
  In order to change the properties of a dashboard
  As a jashboard client
  I want to update the dashboard name

  Scenario: Update dashboard name
    Given a dashboard with id "dashboard_1" and name "test dashboard" with no monitors

    When I request to update the dashboard with id "dashboard_1" with name "test dashboard with another name"

    Then the app should return a successful response without content
    And the dashboard should be saved in the repository