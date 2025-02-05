import { useState, useEffect } from "react";
import { searchFlightsService, FlightsResponse, Flight } from "../services/api";
import { toast } from "react-toastify";

export interface Carrier {
  name: string;
  logoUrl: string;
}

export interface SearchParams {
  originSkyId: string;
  destinationSkyId: string;
  originEntityId: string;
  destinationEntityId: string;
  date: string;
  returnDate?: string;
}

const useFlights = () => {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [carriers, setCarriers] = useState<Carrier[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [params, setParams] = useState<SearchParams | null>(null);

  useEffect(() => {
    if (!params) return;

    const fetchFlights = async (searchParams: SearchParams) => {
      setLoading(true);
      console.log("useFlights - Fetching flights with params:", searchParams);

      try {
        const data: FlightsResponse = await searchFlightsService(searchParams);
        console.log("useFlights - API response:", data);

        if (data.status) {
          // Check if itineraries are empty
          const fetchedFlights = data.data?.itineraries || [];
          if (fetchedFlights.length === 0) {
            // If status is true but no flights
            toast.info("No flights found for the selected criteria.");
          }
          setFlights(fetchedFlights);

          // Carriers
          const c = data.data?.filterStats?.carriers || [];
          setCarriers(c);
        } else {
          // If data.status is false
          toast.info("No flights found for the selected criteria.");
          setFlights([]);
          setCarriers([]);
        }
      } catch (error: any) {
        console.error(
          "useFlights - Error fetching flights:",
          error.response || error
        );
        toast.error("Error fetching flight data.");
        setFlights([]);
        setCarriers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFlights(params);
  }, [params]);

  const searchFlights = (searchParams: SearchParams) => {
    console.log("useFlights - Setting search parameters:", searchParams);
    setParams(searchParams);
  };

  return { flights, carriers, loading, searchFlights };
};

export default useFlights;
