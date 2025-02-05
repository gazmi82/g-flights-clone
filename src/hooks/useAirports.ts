// src/hooks/useAirports.ts
import { useState, useEffect } from "react";
import { searchAirportsService, Airport } from "../services/api";
import { toast } from "react-toastify";
import useDebounce from "./useDebounce";

const useAirports = (query: string) => {
  const [airports, setAirports] = useState<Airport[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // Use the custom debounce hook for typing
  const debouncedQuery = useDebounce(query, 200);

  useEffect(() => {
    if (!debouncedQuery) {
      setAirports([]);
      return;
    }

    const fetchAirports = async () => {
      setLoading(true);
      try {
        const data = await searchAirportsService(debouncedQuery);
        if (data.status) {
          setAirports(data.data);
        }
      } catch (err) {
        toast.error("Error fetching airport suggestions.");
      } finally {
        setLoading(false);
      }
    };

    fetchAirports();
  }, [debouncedQuery]);

  return { airports, loading };
};

export default useAirports;
