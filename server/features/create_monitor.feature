Feature: Create a new monitor
  In order to display a monitor
  As a jashboard client 
  I want to create a monitor for an existing dashboard  
  
  Scenario Outline: Create Monitor returns the persisted monitor with its id
    Given a dashboard with id "dashboard_1" and name "first dashboard" and monitors "monitor_1"

    When I request the creation of a monitor for dashboard "dashboard_1" with <name>, <refresh_interval>, of type <type>, position <position>, size <size>, configured as <config>

    Then the app should return a response containing a new monitor with name <name>, refresh interval <refresh_interval>, type <type> and an id

    Examples:
    | name          | refresh_interval | type  | position | size   | config                                                                                   |
    | build monitor | 10               | build | 10,20    | 50x100 | {type: "jenkins", hostname: "zombie-dev.host.com", port: 9080, build_id: "zombie_build"} |
    | ipsum monitor | 10               | ipsum | 20,30    | 140x90 | {no_sentences: 10, language: "english"}                                                  |

  Scenario Outline: Create Monitor links the monitor to the corresponding dashboard
    Given the following monitors
    | id        | name              | type  | refresh_interval | configuration                                                                              |
    | monitor_1 | Zombie-Dash build | build | 10               | { type: "jenkins", hostname: "zombie-dev.host.com", port: 9080, build_id: "zombie_build" } |

    And a dashboard with id "dashboard_1" and name "first dashboard" and monitors "monitor_1"

    When I request the creation of a monitor for dashboard "dashboard_1" with <name>, <refresh_interval>, of type <type>, position <position>, size <size>, configured as <config>
    And I request all the dashboards

    Then the app should return a response containing a dashboard with id "dashboard_1", and monitors
    | name              | refresh_interval | type  |
    | Zombie-Dash build | 10               | build |
    | test monitor      | 1000             | build |

    Examples:
    | name         | refresh_interval | type  | position | size   | config                                                                           |
    | test monitor | 1000             | build | 30,100   | 40x100 | {type: "jenkins", hostname: "test.host.com", port: 8082, build_id: "test_build"} |
