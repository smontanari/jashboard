Feature: Update monitor details
  In order to change the behaviour of a monitor
  As a jashboard client 
  I want to update the monitor details

  Scenario Outline: Update monitor position
    Given the following monitors
    | id        | name              | type  | refresh_interval | configuration                                                                    |
    | monitor_1 | Zombie-Dash build | build | 10               | { type: "jenkins", hostname: "localhost", port: 8000, build_id: "zombie_build" } |

    When I request to update the position of monitor <monitor_id> with coordinates <top>, <left>

    Then the app should return a successful response
    And monitor <monitor_id> position should have coordinates updated to <top>, <left>

    Examples:
    | monitor_id | top | left |
    | monitor_1  | 123 | 456  |