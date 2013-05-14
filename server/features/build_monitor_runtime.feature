Feature: Get build monitor runtime data
  In order to display build monitor data
  As a jashboard client 
  I want to request runtime information for an existing monitor  

  @use_stub_server
  Scenario: Load jenkins build monitor runtime returns corresponding runtime data
    Given a jenkins build server running the following builds
    | build_id     | build_response_fixture                           | project_response_fixture                        |
    | zombie_build | plugins/build/jenkins-lastbuild-success-response | plugins/build/jenkins-project-building-response |

    And the following monitors
    | id        | name              | type  | refresh_interval | position | size    | configuration                                                                    |
    | monitor_1 | Zombie-Dash build | build | 10               | 100,200  | 230x120 | { type: "jenkins", hostname: "localhost", port: 8000, build_id: "zombie_build" } |

    When I request the runtime info for monitor monitor_1

    Then the app should return the json response "fixture_build_monitor_1.json"

  Scenario: Load build monitor runtime returns error
    Given the following monitors
    | id        | name              | type  | refresh_interval | position | size    | configuration                                                                    |
    | monitor_1 | Zombie-Dash build | build | 10               | 100,200  | 230x120 | { type: "jenkins", hostname: "localhost", port: 8000, build_id: "zombie_build" } |

    When I request the runtime info for monitor monitor_1

    Then the app should return the error response "Connection refused - connect(2)"
