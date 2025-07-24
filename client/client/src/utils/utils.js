// utils.js
export function getImportanceText(value) {
  if (value < 0.3) return "Doesn't Matter to me";
  if (value < 0.6) return 'Somewhat important';
  if (value < 0.8) return 'Very important';
  return 'Extremely Important';
}

export function sumsToOne(arrayOfWeights) {
  return Math.abs(arrayOfWeights.reduce((accumulator, currentValue) => accumulator + currentValue, 0) - 1) < 0.01;
}
