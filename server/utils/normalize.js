// initiate a function normalize the city name to lowercase and trim whitespace
export function normalizeCity(city) {
    return city?.trim().toLocaleLowerCase() || null;
}

// initiate a function normalize the value of the input to a number between 0 and 1
export function normalize(value, min, max) {
  return value ? (value - min) / (max - min) || 0 : 0;

}
