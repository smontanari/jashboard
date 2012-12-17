Feature: Create a new dashboard
  In order to display my monitors
  As a jashboard client 
  I want to create a dashboard to contain them

  Scenario: Create dashboard
    When I request the creation of a dashboard with name "test dashboard"

    Then the app should return a response containing an empty dashboard with name "test dashboard" and an id
