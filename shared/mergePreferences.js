// shared/mergePreferences.js
export function mergePreferences(userPreferences, bodyWeights = {}) {
  return { ...userPreferences, ...bodyWeights };
}
