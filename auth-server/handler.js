'use strict';

/* eslint-disable no-undef */
const { google } = require('googleapis');
const calendar = google.calendar('v3');
const SCOPES = ['https://www.googleapis.com/auth/calendar.readonly'];
const { CLIENT_ID, CLIENT_SECRET, CALENDAR_ID } = process.env;

// Configure OAuth2 client
const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  'https://sloykyrsx3.execute-api.eu-central-1.amazonaws.com/dev/api/callback'
);

/* eslint-disable no-unused-vars */
module.exports.getAuthURL = async (event) => {
/* eslint-enable no-unused-vars */
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
    body: JSON.stringify({
      authUrl,
    }),
  };
};

module.exports.getAccessToken = async (event) => {
  const code = JSON.parse(event.body).code;

  try {
    const { tokens } = await oAuth2Client.getToken(code);
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify(tokens),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify({ error: 'Error getting access token' }),
    };
  }
};

module.exports.getCalendarEvents = async (event) => {
  // Get access token from the URL path parameter
  const access_token = decodeURIComponent(`${event.pathParameters.access_token}`);

  // Set credentials
  oAuth2Client.setCredentials({ access_token });

  return new Promise((resolve, reject) => {
    calendar.events.list(
      {
        calendarId: CALENDAR_ID,
        auth: oAuth2Client,
        timeMin: new Date().toISOString(),
        singleEvents: true,
        orderBy: "startTime",
      },
      (error, response) => {
        if (error) {
          reject(error);
        } else {
          resolve(response);
        }
      }
    );
  })
    .then((results) => {
      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true,
        },
        body: JSON.stringify({ events: results.data.items })
      };
    })
    .catch((error) => {
      return {
        statusCode: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true,
        },
        body: JSON.stringify(error),
      };
    });
};

module.exports.handleGoogleRedirect = async (event) => {
  if (!event.queryStringParameters?.code) {
    return {
      statusCode: 400,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify({
        error: 'No code provided'
      })
    };
  }

  const code = event.queryStringParameters.code;
  
  try {
    // Get tokens right away instead of storing the code
    const { tokens } = await oAuth2Client.getToken(code);
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'text/html',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: `
        <html>
          <body>
            <h1>Authorization successful!</h1>
            <p>You can close this window and return to the application.</p>
            <script>
              // Store tokens instead of code
              localStorage.setItem('access_token', '${tokens.access_token}');
              if ('${tokens.refresh_token}') {
                localStorage.setItem('refresh_token', '${tokens.refresh_token}');
              }
              window.close();
            </script>
          </body>
        </html>
      `
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'text/html',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: `
        <html>
          <body>
            <h1>Authorization failed!</h1>
            <p>Error: ${error.message}</p>
            <p>Please close this window and try again.</p>
          </body>
        </html>
      `
    };
  }
};
