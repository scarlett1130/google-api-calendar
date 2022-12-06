import React, { useEffect, useState } from "react";
import "./App.css";
import { gapi } from "gapi-script";
import Event from "./components/Event.js";
 
function App() {
  const [events, setEvents] = useState([]);
 
  const calendarID = process.env.REACT_APP_CALENDAR_ID;
  const apiKey = process.env.REACT_APP_GOOGLE_API_KEY;
  const accessToken = process.env.REACT_APP_GOOGLE_ACCESS_TOKEN;
 
  const getEvents = (calendarID, apiKey) => {
    function initiate() {
      gapi.client
        .init({
          apiKey: apiKey,
        })
        .then(function () {
          return gapi.client.request({
            path: `https://www.googleapis.com/calendar/v3/calendars/${calendarID}/events`,
          });
        })
        .then(
          (response) => {
            let events = response.result.items;
            setEvents(events);
          },
          function (err) {
            return [false, err];
          }
        );
    }
    gapi.load("client", initiate);
  };
 
  const addEvent = (calendarID, event) => {
  function initiate() {
    gapi.client
      .request({
        path: `https://www.googleapis.com/calendar/v3/calendars/${calendarID}/events`,
        method: "POST",
        body: event,
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then(
        (response) => {
          return [true, response];
        },
        function (err) {
          console.log(err);
          return [false, err];
        }
      );
  }
  gapi.load("client", initiate);
};

var event = {
  summary: "Hello World",
  location: "",
  start: {
    dateTime: "2022-08-28T09:00:00-07:00",
    timeZone: "America/Los_Angeles",
  },
  end: {
    dateTime: "2022-08-28T17:00:00-07:00",
    timeZone: "America/Los_Angeles",
  },
  recurrence: ["RRULE:FREQ=DAILY;COUNT=2"],
  attendees: [],
  reminders: {
    useDefault: false,
    overrides: [
      { method: "email", minutes: 24 * 60 },
      { method: "popup", minutes: 10 },
    ],
  },
};

  useEffect(() => {
    const events = getEvents(calendarID, apiKey);
    setEvents(events);
  }, []);
 
  return (
    <div className="App py-8 flex flex-col justify-center">
      <h1 className="text-2xl font-bold mb-4">
        React App with Google Calendar API!
        <ul>
          {events?.map((event) => (
            <li key={event.id} className="flex justify-center">
              <Event description={event.summary} />
            </li>
          ))}
        </ul>
      </h1>
    </div>
  );
}
 
export default App;