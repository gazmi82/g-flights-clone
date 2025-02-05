// src/App.tsx
import React from "react";
import FlightSearch from "./components/FlightSearch/FlightSearch";
import { StrictMode } from "react";
import "./index.scss";

const App: React.FC = () => {
  return (
    <StrictMode>
      <div className="App">
        <FlightSearch />
      </div>
    </StrictMode>
  );
};

export default App;
