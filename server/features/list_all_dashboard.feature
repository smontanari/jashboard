Feature: Get dashboards
  In order to display my dashboards
  As a jashboard client 
  I want to retrieve all dashboards information

  Scenario: List all dashboards with monitors
    Given the following monitors
    | id        | name               | type  | refresh_interval | position | size    | configuration                                                                                                                         |
    | monitor_1 | Zombie-Dash build  | build | 10000            | 0,0      | 240x140 | { type: "jenkins", hostname: "zombie-dev.host.com", port: 9080, build_id: "zombie_build" }                                            |
    | monitor_2 | Epic build         | build |                  | 80,10    | 240x140 | { type: "go", hostname: "epic-ci.test.com", port: 81, pipeline: "epic main", stage: "epic build", job: "unit-integration tests" }     |
    | monitor_3 | Random text        | ipsum | 15000            | 20,400   | 280x150 | { number_of_sentences: 3, language: "english"}                                                                                        |
    | monitor_5 | Jashboard Git repo | vcs   | 20000            | 60,300   | 480x280 | { type: "git", working_directory: "/path/to/repo", branch: "master", history_length: 5, slide_show_effect: true, commits_per_page: 2} |

    And a dashboard with id "dashboard_1" and name "first dashboard" and monitors "monitor_1,monitor_5"
    
    And a dashboard with id "dashboard_2" and name "second dashboard" and monitors "monitor_2,monitor_3"

    And a dashboard with id "dashboard_3" and name "another dashboard" with no monitors

    When I request all the dashboards

    Then the app should return the json response "fixture_dashboards.json"

