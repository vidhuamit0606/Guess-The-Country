import { LatLngTuple, LeafletMouseEvent } from "leaflet";
import { ReactNode } from "react";
import { Marker, useMap } from "react-leaflet";
import { usePlayerMarker } from "../../store/playerMakerContext";

interface CenteredMarkerProps {
  children?: ReactNode;
}

const PlayerMarker = ({ children }: CenteredMarkerProps) => {
  const map = useMap();
  const { playerMarker, setPlayerMarker } = usePlayerMarker();

  function getNewPosition(event: LeafletMouseEvent) {
    const newPosition: LatLngTuple = [event.latlng.lat, event.latlng.lng];
    setPlayerMarker(newPosition);
  }

  map.addEventListener("click", getNewPosition);

  return <Marker position={playerMarker}>{children}</Marker>;
};

export default PlayerMarker;
