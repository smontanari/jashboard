Feature: Get vcs monitor runtime data
  In order to display vcs monitor data
  As a jashboard client 
  I want to request runtime information for an existing monitor  

  Scenario: Load vcs monitor runtime returns corresponding runtime data
    Given the following monitors
    | id        | name        | type | refresh_interval | position | size    | configuration                                                            |
    | monitor_1 | Git Monitor | vcs  | 10               | 100,200  | 230x120 | { type: "git", working_directory: "../", branch: "functest-git-do-not-delete", history_length: 3} |

    When I request the runtime info for monitor monitor_1

    Then the app should return the json response "fixture_vcs_monitor.json"
