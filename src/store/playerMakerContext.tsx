import { LatLngTuple } from "leaflet";
import { createContext, ReactNode, useContext, useState } from "react";

interface PlayerMarker {
  initialMarkerPosition: LatLngTuple;
  playerMarker: LatLngTuple;
  setPlayerMarker: (position: LatLngTuple) => void;
}

interface ProviderProps {
  children: ReactNode;
}

const initContextState = {
  initialMarkerPosition: [51, 10] as LatLngTuple,
  playerMarker: [51, 10] as LatLngTuple,
  setPlayerMarker: () => {},
};

const PlayerMarkerContext = createContext<PlayerMarker>(initContextState);

export const PlayerMarkerProvider = ({ children }: ProviderProps) => {
  const initialMarkerPosition: LatLngTuple = [51, 10];
  const [playerMarker, setPlayerMarker] = useState<LatLngTuple>(initialMarkerPosition);

  function changePlayerMarker(position: LatLngTuple) {
    setPlayerMarker(position);
  }

  const values = {
    initialMarkerPosition,
    playerMarker,
    setPlayerMarker: changePlayerMarker,
  };

  return <PlayerMarkerContext.Provider value={values}>{children}</PlayerMarkerContext.Provider>;
};

export const usePlayerMarker = () => useContext(PlayerMarkerContext);
