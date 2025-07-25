// initiate a function normalize the city name to lowercase and trim whitespace
export function normalizeCity(cityName) {
    return cityName?.trim().toLocaleLowerCase() || null;
}
// initiate a function normalize the value of the input to a number between 0 and 1
export function normalize(value, min, max) {
  if (!value) return 0;
  const normalized = (value - min) / (max - min);
  return Math.max(0, Math.min(1, isNaN(normalized) ? 0 : normalized));

}
