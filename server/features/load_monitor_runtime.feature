Feature: Load monitor runtime data
  In order to display monitor data
  As a jashboard client 
  I want to request runtime information for an existing monitor  

  @use_stub_server
  Scenario: Load build monitor runtime returns corresponding runtime data
    Given a jenkins build server at port 8000 running the following builds
    | build_id      | response_fixture                   |
    | zombie_build  | jenkins-lastbuild-success-response |

    And the following monitors
    | id        | name              | type  | refresh_interval | configuration                                                                    |
    | monitor_1 | Zombie-Dash build | build | 10               | { type: "jenkins", hostname: "localhost", port: 8000, build_id: "zombie_build" } |

    When I request the runtime info for monitor monitor_1

    Then the app should return the json response "fixture_build_monitor_1.json"
