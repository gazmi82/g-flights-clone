# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

# React Flight Search Instructions

## Usage Flow

1. **Enter Origin**  
   Type a city or airport. The app may fetch suggestions with a delay of 200 milliseconds to avoid to many calls in server.

2. **Enter Destination**  
   Same as above.

3. **Select Dates**  
   Choose your Departure Date and an optional Return Date.

4. **Search Flights**  
   Click the **Search Flights** button.
   - The app calls its custom hooks (`useFlights`, `useAirports`) to fetch data from the Sky Scrapper API via RapidAPI.
   - If flights are found, they appear in a responsive grid; otherwise, a Toastify message indicates no results.

---

## Project Structure

react-flight-search/
├── public/
├── src/
│ ├── components/
│ │ └── FlightSearch/
│ │ ├── FlightSearch.tsx
│ │ └── FlightSearch.scss
│ ├── hooks/
│ │ ├── useAirports.ts // Custom hook airport suggestions
│ │ ├── useFlights.ts // Custom hook flight data fetching
│ │ └── useDebounce.ts // Custom hook with delay
│ ├── services/
│ │ └── api.ts // Your API integration
│ ├── App.tsx
│ ├── index.tsx
│ └── index.css
├── .env // Contains REACT_APP_RAPIDAPI_KEY
├── package.json
└── README.md
