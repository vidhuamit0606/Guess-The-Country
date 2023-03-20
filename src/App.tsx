import { SetStateAction, useEffect, useState } from "react";
import { MapContainer, TileLayer, Popup, Marker } from "react-leaflet";
import redMarker from "./styles/redMarker";
import "./App.css";
import PlayerMarker from "./components/Map/PlayerMarker";
import useCities from "./hooks/useCities";
import { usePlayerMarker } from "./store/playerMakerContext";
import calculateDistance from "./util/calculateDistance";
import useLocalStorage from "./hooks/useLocalStorage";

function App() {
  let delayTimer: ReturnType<typeof setTimeout>;

  const [kmLeft, setKmLeft] = useState(1500);
  const [distanceOfGuess, setDistanceOfGuess] = useState<number | null>(null);
  const [showCurrentCityMarker, setShowCurrentCityMarker] = useState(false);
  const [guessedCities, setGuessedCities] = useState(0);
  const [currentHighscore, setCurrentHighScore] = useState(useLocalStorage("get", "highscore") ?? 0);
  const [newHighscore, setNewHighscore] = useState<number | null>(null);
  const citiesToBeGuessed = useCities();
  const [currentCityIndex, setCurrentCityIndex] = useState(0);
  const currentCity = citiesToBeGuessed[currentCityIndex];
  const { initialMarkerPosition, playerMarker, setPlayerMarker } = usePlayerMarker();
  const isGameOver = kmLeft <= 0;

  useEffect(() => {
    if (showCurrentCityMarker) {
      delayTimer = setTimeout(() => {
        setShowCurrentCityMarker(false);
        setCurrentCityIndex(prevIndex => (prevIndex < citiesToBeGuessed.length - 1 ? prevIndex + 1 : 0));
      }, 2000);

      return () => clearTimeout(delayTimer);
    }
  }, [showCurrentCityMarker]);

  useEffect(() => {
    if (guessedCities > currentHighscore) {
      setNewHighscore(guessedCities);

      if (isGameOver) {
        useLocalStorage("set", "highscore", guessedCities);
      }
    }
  }, [guessedCities, isGameOver]);

  const distanceText =
    distanceOfGuess! <= 50 ? (
      <h2 style={{ color: "green" }}>Awesome! The distance is {distanceOfGuess}km</h2>
    ) : (
      <h2 style={{ color: "red" }}>Nope! The distance is {distanceOfGuess}km</h2>
    );

  function handleAnswerSubmission() {
    if (isGameOver) {
      return;
    }

    const distance = calculateDistance(
      { lat: playerMarker[0], lng: playerMarker[1] },
      { lat: currentCity?.lat, lng: currentCity?.long }
    );

    if (distance! <= 50) setGuessedCities(prev => prev + 1);
    setShowCurrentCityMarker(true);
    setDistanceOfGuess(distance);
    setKmLeft(prev => (prev -= distance));
  }

  function startNewGame() {
    setGuessedCities(0);
    setKmLeft(1500);
    setCurrentCityIndex(0);
    if (guessedCities > currentHighscore) {
      setCurrentHighScore(newHighscore as SetStateAction<number>);
    }
    setNewHighscore(null);
    setPlayerMarker(initialMarkerPosition);
  }

  return (
    <div className="app-container">
      <h1>
        {guessedCities} {guessedCities === 1 ? "city" : "cities"} guessed correctly
      </h1>
      {isGameOver && <h1>Game over!</h1>}

      {!isGameOver && <h1>{kmLeft} kilometers left</h1>}

      {isGameOver && newHighscore && <h1>NEW HIGHSCORE!!!</h1>}

      {!isGameOver && !showCurrentCityMarker && <h2>Select the location of {currentCity?.capitalCity}</h2>}

      {showCurrentCityMarker && distanceText}

      {isGameOver && !showCurrentCityMarker && (
        <h2>
          You have guessed {guessedCities} {guessedCities === 1 ? "city" : "cities"}!
        </h2>
      )}
      <MapContainer
        style={{ height: "450px", width: "100%", margin: "30px 0" }}
        center={initialMarkerPosition}
        zoom={5}
        minZoom={4}
        maxZoom={7}>
        <TileLayer url="https://a.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}@2x.png" />
        <PlayerMarker>
          <Popup>Your guess</Popup>
        </PlayerMarker>
        {showCurrentCityMarker && (
          <Marker
            icon={redMarker}
            position={{ lat: currentCity?.lat, lng: currentCity?.long }}>
            <Popup>{currentCity?.capitalCity}</Popup>
          </Marker>
        )}
      </MapContainer>
      <footer>
        {!!currentHighscore ? <h3>HighScore: {newHighscore ? newHighscore : currentHighscore}</h3> : null}
        {!isGameOver && (
          <button
            disabled={showCurrentCityMarker}
            onClick={handleAnswerSubmission}>
            Submit Answer
          </button>
        )}
        {isGameOver && (
          <button
            disabled={showCurrentCityMarker}
            onClick={startNewGame}>
            Play another round
          </button>
        )}
      </footer>
    </div>
  );
}

export default App;
