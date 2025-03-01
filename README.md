# Meet App

## Overview

Meet App is a serverless, progressive web application (PWA) built with React using a test-driven development (TDD) approach. The app leverages the Google Calendar API to fetch upcoming events and includes features such as offline access, a home screen shortcut, and data visualization. This project demonstrates modern web development practices such as serverless functions, responsive design, and progressive enhancement.

**Project Technologies:**
- React (created with Vite)
- Test-Driven Development (TDD)
- Serverless functions (AWS Lambda preferred)
- Progressive Web App (PWA) features (offline support, installable shortcut)
- Data visualization (charts for event details)
- Deployment on Vercel

## Architecture 

graph TD
  A[User Browser] --> B[React App (Hosted on Vercel/Github Pages)]
  B --> C[Authentication Request]
  C --> D[AWS Lambda Function<br/>(Auth Server)]
  D --> E[Google OAuth Server]
  E --> D
  D --> F[Access Token]
  F --> B
  B --> G[API Request for Events]
  G --> H[AWS Lambda Function<br/>(Event Fetcher)]
  H --> I[Google Calendar API]
  I --> H
  H --> B

## User Stories & Features

### Feature 1: Filter Events By City
**User Story:**  
_As a user, I should be able to filter events by city so that I can see a list of events taking place in my chosen city._

### Feature 2: Show/Hide Event Details
**User Story:**  
_As a user, I should be able to toggle the visibility of event details so that I can view additional information about an event when needed and hide it when it’s not required._

### Feature 3: Specify Number of Events
**User Story:**  
_As a user, I should be able to set the number of events displayed so that I can control the amount of information shown and avoid an overwhelming list._

### Feature 4: Use the App When Offline
**User Story:**  
_As a user, I should be able to access the app offline so that I can view cached event data and receive proper feedback when connectivity issues occur._

### Feature 5: Add an App Shortcut to the Home Screen
**User Story:**  
_As a user, I should be able to install the Meet app as a shortcut on my device’s home screen so that I can quickly launch the app without navigating through a browser._

### Feature 6: Display Charts Visualizing Event Details
**User Story:**  
_As a user, I should be able to view visual charts (such as a scatterplot for events per city and a pie chart for event genres) so that I can easily understand trends and the distribution of events and genres at a glance._

## Gherkin Scenarios

### Feature: Filter Events By City

Scenario: Show all upcoming events when no city is searched
  Given the user has not entered a city in the search field
  When the user opens the app
  Then the user should see upcoming events from all cities

Scenario: Display city suggestions as user types in the search field
  Given the app is open on the main page
  When the user starts typing a city name into the search field
  Then a list of matching city suggestions should be displayed

Scenario: Select a city from the suggestions
  Given the user has typed a partial city name and the suggestions list is visible
  When the user selects a city (e.g., "Berlin, Germany") from the list
  Then the app should update to show upcoming events in "Berlin, Germany"

Scenario: Event details are collapsed by default
  Given the list of events has been loaded
  When each event is displayed
  Then the event details should be hidden by default

Scenario: Expand event details
  Given an event's details are hidden
  When the user clicks the "Details" button for that event
  Then the event details should be displayed

Scenario: Collapse event details
  Given an event's details are currently expanded
  When the user clicks the "Hide Details" button
  Then the event details should be hidden

Scenario: Display default number of events
  Given the user has not specified a number of events to display
  When the app loads
  Then 32 events should be shown by default

Scenario: Change the number of events displayed
  Given 32 events are displayed by default
  When the user enters a different number in the event count field
  Then the app should update to show the specified number of events

Scenario: Display cached data when offline
  Given the user is offline with no internet connection
  When the user opens the app
  Then the app should display cached event data

Scenario: Show error when changing search settings while offline
  Given the user is offline
  When the user attempts to change search settings (such as city or number of events)
  Then an error message should be displayed indicating that settings cannot be updated offline

Scenario: Add app shortcut to home screen
  Given the user is using a compatible device
  When the user selects the option to install the app on their home screen
  Then the Meet app should be added as a shortcut on the device's home screen

Scenario: Display chart of upcoming events per city
  Given the event data is loaded
  When the user navigates to the data visualization section
  Then a chart should be displayed showing the number of upcoming events in each city

##Setup & Deployment Instructions
Clone the Repository using SSH:

bash
git clone git@github.com:YOUR_USERNAME/meet.git

##Navigate to the Project Folder:

bash
cd meet

##Install Dependencies:

bash
npm install

##Run the Development Server:

bash
npm run dev
The app will be accessible at http://localhost:5173/.

##Push Code to GitHub:

bash
git add .
git commit -m "Initial commit"
git push -u origin main

##Deploy to Vercel:

Log in to your Vercel dashboard.
Import your GitHub repository and follow the prompts to deploy the app.
Once deployed, your app will be available at the public URL provided by Vercel.