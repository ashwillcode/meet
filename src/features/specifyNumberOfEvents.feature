Feature: Specify Number of Events
  As a user
  I want to be able to specify the number of events I want to see
  So that I can control the amount of information displayed

  Scenario: Default number of events
    Given the user hasn't specified a number of events
    When the user opens the app
    Then 32 events should be shown by default

  Scenario: User can change the number of events they want to see
    Given the user is on the main page
    When the user enters "10" in the number of events input
    Then the app should display 10 events

  Scenario: User enters an invalid number
    Given the user is on the main page
    When the user enters "0" in the number of events input
    Then the app should display an error message "Number must be greater than 0"

  Scenario: User enters a number larger than total events available
    Given the user is on the main page
    And there are only 3 events available
    When the user enters "10" in the number of events input
    Then the app should display all 3 events 