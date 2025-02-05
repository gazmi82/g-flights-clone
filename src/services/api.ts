// src/services/api.ts
import axios from "axios";

export interface FlightSegment {
  departure?: string;
  arrival?: string;
  operatingCarrier?: any;
  flightNumber?: string;
}

export interface FlightLeg {
  segments?: FlightSegment[];
}

export interface Flight {
  id?: string;
  airline?: string;
  flightNumber?: string;
  departureTime?: string;
  arrivalTime?: string;

  price?: {
    raw?: number;
    formatted?: string;
    pricingOptionId?: string;
  };
  legs?: FlightLeg[];
}

export interface Airport {
  skyId: string;
  entityId: string;
  presentation: {
    title: string;
    suggestionTitle: string;
    subtitle: string;
  };
}

export interface FlightsResponse {
  status: boolean;
  timestamp: number;
  sessionId: string;
  data: {
    context: {
      status: string;
      totalResults: number;
    };
    destinationImageUrl: string;
    filterStats: any;
    flightsSessionId: string;
    itineraries: Flight[];
  };
  messages: any[];
}

const api = axios.create({
  baseURL: "https://apiheya-sky-scrapper.p.rapidapi.com",
  headers: {
    "X-RapidAPI-Key": process.env.REACT_APP_RAPIDAPI_KEY || "",
    "X-RapidAPI-Host": "sky-scrapper.p.rapidapi.com",
  },
});

export default api;

export const searchAirportsService = async (
  query: string
): Promise<{ status: boolean; data: Airport[] }> => {
  const response = await api.get("/api/v1/flights/searchAirport", {
    params: { query },
  });
  return response.data;
};

export const searchFlightsService = async (params: {
  originSkyId: string;
  destinationSkyId: string;
  originEntityId: string;
  destinationEntityId: string;
  date: string;
  returnDate?: string;
}): Promise<FlightsResponse> => {
  const response = await api.get("/api/v1/flights/searchFlights", { params });
  return response.data;
};
