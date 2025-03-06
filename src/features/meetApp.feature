Feature: Meet App - Filtering Events, Showing Details, and Updating Event Count

Scenario: Show all upcoming events when no city is searched
  Given the user has not entered a city in the search field
  When the user opens the app
  Then the user should see upcoming events from all cities

Scenario: Expand event details
  Given an event's details are hidden
  When the user clicks the "Details" button for that event
  Then the event details should be displayed

Scenario: Change the number of events displayed
  Given 32 events are displayed by default
  When the user enters a different number in the event count field
  Then the app should update to show the specified number of events
