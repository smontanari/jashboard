Feature: Delete dashboard
  In order to remove a dashboard and all its monitors
  As a jashboard client 
  I want to delete the dashboard

  Scenario: Remove a dashboard
    Given the following monitors
    | id        | name              | type  | refresh_interval | position | size    | configuration                                                                                                                     |
    | monitor_1 | Epic build        | build | 15               | 45,80    | 80x240  | { type: "go", hostname: "epic-ci.test.com", port: 81, pipeline: "epic main", stage: "epic build", job: "unit-integration tests" } |
    | monitor_2 | Random text       | ipsum | 30               | 270,300  | 140x230 | { number_of_sentences: 3, language: "english"}                                                                                           |

    And a dashboard with id "test_dashboard" and name "dashboard" and monitors "monitor_1,monitor_2"

    When I request the deletion of dashboard "test_dashboard"

    Then the app should return a successful response without content
    And monitor "monitor_1" should be removed from the repository
    And monitor "monitor_2" should be removed from the repository
    And dashboard "test_dashbord" should be removed from the repository

