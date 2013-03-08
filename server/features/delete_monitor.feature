Feature: Delete monitor
  In order to remove a monitor from a dashboard
  As a jashboard client 
  I want to delete the monitor

  Scenario: Remove a monitor
    Given the following monitors
    | id        | name              | type  | refresh_interval | configuration                                                                                                                     |
    | monitor_1 | Zombie-Dash build | build | 10               | { type: "jenkins", hostname: "zombie-dev.host.com", port: 9080, build_id: "zombie_build" }                                        |
    | monitor_2 | Epic build        | build | 15               | { type: "go", hostname: "epic-ci.test.com", port: 81, pipeline: "epic main", stage: "epic build", job: "unit-integration tests" } |
    | monitor_3 | Random text       | ipsum | 30               | { no_sentences: 3, language: "english"}                                                                                           |

    And a dashboard with id "dashboard_1" and name "dashboard" and monitors "monitor_1,monitor_2,monitor_3"

    When I request the deletion of monitor "monitor_2"

    Then the app should return a successful response
    And monitor "monitor_2" should be removed from the repository
    And dashboard "dashboard_1" should contain monitors "monitor_1,monitor_3"

