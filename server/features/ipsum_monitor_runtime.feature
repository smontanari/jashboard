Feature: Get ipsum monitor runtime data
  In order to display ipsum monitor data
  As a jashboard client 
  I want to request runtime information for an existing monitor  

  Scenario: Load ipsum monitor runtime returns corresponding runtime data
    Given the following monitors
    | id        | name          | type  | refresh_interval | position | size    | configuration                           |
    | monitor_1 | Ipsum Monitor | ipsum | 10               | 100,200  | 230x120 | { number_of_sentences: 3, language: "english"} |

    When I request the runtime info for monitor monitor_1

    Then the app should return a json response matching '^\{"text"\:".+"\}$'
