Feature: Get monitor runtime data
  In order to display monitor data
  As a jashboard client 
  I want to request runtime information for an existing monitor  

  @use_stub_server
  Scenario: Load build monitor runtime returns corresponding runtime data
    Given a jenkins build server at port 8000 running the following builds
    | build_id      | response_fixture                   |
    | zombie_build  | jenkins-lastbuild-success-response |

    And the following monitors
    | id        | name              | type  | refresh_interval | position | size    | configuration                                                                    |
    | monitor_1 | Zombie-Dash build | build | 10               | 100,200  | 230x120 | { type: "jenkins", hostname: "localhost", port: 8000, build_id: "zombie_build" } |

    When I request the runtime info for monitor monitor_1

    Then the app should return the json response "fixture_build_monitor_1.json"

  Scenario: Load ipsum monitor runtime returns corresponding runtime data
    Given the following monitors
    | id        | name          | type  | refresh_interval | position | size    | configuration                           |
    | monitor_1 | Ipsum Monitor | ipsum | 10               | 100,200  | 230x120 | { no_sentences: 3, language: "english"} |

    When I request the runtime info for monitor monitor_1

    Then the app should return a json response matching '^\{"text"\:".+"\}$'

  Scenario: Load vcs monitor runtime returns corresponding runtime data
    Given the following monitors
    | id        | name        | type | refresh_interval | position | size    | configuration                                                            |
    | monitor_1 | Git Monitor | vcs  | 10               | 100,200  | 230x120 | { type: "git", working_directory: "../", branch: "test-git-do-not-delete", history_length: 3} |

    When I request the runtime info for monitor monitor_1

    Then the app should return the json response "fixture_vcs_monitor.json"

  Scenario: Load build monitor runtime returns error
    Given the following monitors
    | id        | name              | type  | refresh_interval | position | size    | configuration                                                                    |
    | monitor_1 | Zombie-Dash build | build | 10               | 100,200  | 230x120 | { type: "jenkins", hostname: "localhost", port: 8000, build_id: "zombie_build" } |

    When I request the runtime info for monitor monitor_1

    Then the app should return the error response "Connection refused - connect(2)"
