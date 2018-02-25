const { google } = require('googleapis');
const calendar = google.calendar('v3');
const NodeCache = require('node-cache');

const API_KEY = process.env.API_KEY; 
const CALENDAR_ID = process.env.CALENDAR_ID; 
const cache = new NodeCache();

if (!API_KEY) {
  throw new Error('API_KEY not set');
}

if (!CALENDAR_ID) {
  throw new Error('CALENDAR_ID not set');
}

function getItems() {
  return new Promise((resolve, reject) => {
    let cachedItems = cache.get('calendar-items');

    if (cachedItems) {
      return resolve(cachedItems);
    }

    calendar.events.list({
      auth: API_KEY,
      calendarId: CALENDAR_ID,
      maxResults: 10,
    }, function (err, response) {
      if (err) {
        return reject(err);
      }

      cache.set('calendar-items', response.data.items, 60);

      resolve(response.data.items);
    });
  });
}

module.exports = getItems;