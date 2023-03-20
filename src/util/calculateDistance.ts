import { LatLngLiteral } from "leaflet";

/**
 * The naming of the variables are based on the Haversine formula
 *
 * @param playerGuess
 * @param currentCity
 * @returns
 */

function calculateDistance(playerGuess: LatLngLiteral, currentCity: LatLngLiteral) {
  const PI = 0.017453292519943295; // Math.PI / 180
  const cos = Math.cos;
  const earthRadiusTimesTwo = 12742;
  const a =
    0.5 -
    cos((currentCity.lat - playerGuess.lat) * PI) / 2 +
    (cos(playerGuess.lat * PI) *
      cos(currentCity.lat * PI) *
      (1 - cos((currentCity.lng - playerGuess.lng) * PI))) /
      2;

  const result = earthRadiusTimesTwo * Math.asin(Math.sqrt(a));

  return Math.round(result);
}

export default calculateDistance;
