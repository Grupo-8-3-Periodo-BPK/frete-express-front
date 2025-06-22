/**
 * Calcula a distância em quilômetros entre dois pontos geográficos.
 * @param {number[]} coords1 - Array com [latitude, longitude] do ponto 1.
 * @param {number[]} coords2 - Array com [latitude, longitude] do ponto 2.
 * @returns {number} - Distância em quilômetros.
 */
export function getDistanceFromLatLonInKm([lat1, lon1], [lat2, lon2]) {
  const R = 6371; // Raio da Terra em km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distância em km
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}
