Feature: Show/Hide Event Details
  As a user
  I should be able to show and hide event details
  So that I can see more/less information about an event

  Scenario: Event details are collapsed by default
    Given the list of events has been loaded
    When each event is displayed
    Then the event details should be hidden by default

  Scenario: User can expand event details
    Given an event's details are hidden
    When the user clicks the "Show Details" button for that event
    Then the event details should be displayed

  Scenario: User can collapse event details
    Given an event's details are currently expanded
    When the user clicks the "Hide Details" button
    Then the event details should be hidden 