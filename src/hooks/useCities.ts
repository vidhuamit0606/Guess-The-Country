import { useEffect, useState } from "react";
import City from "../types/citiesToBeGuessed";

const useCities = () => {
  const [citiesToBeGuessed, setCitiesToBeGuessed] = useState<Array<City>>([]);

  useEffect(() => {
    (async function loadCityData() {
      const res = await fetch("data/capitalCities.json");
      const { capitalCities } = await res.json();
      setCitiesToBeGuessed(capitalCities);
    })();
  }, []);

  return citiesToBeGuessed;
};

export default useCities;
