// Reverse-geocodes browser coordinates to a city name via OpenStreetMap's
// free Nominatim API. No API key required.

export class GeolocationError extends Error {
  constructor(message, code) {
    super(message);
    this.code = code; // 'permission_denied' | 'unavailable' | 'timeout' | 'geocode_failed'
  }
}

const getCoordinates = () =>
  new Promise((resolve, reject) => {
    if (!('geolocation' in navigator)) {
      reject(new GeolocationError('Your browser does not support location detection.', 'unavailable'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => resolve(position.coords),
      (err) => {
        if (err.code === err.PERMISSION_DENIED) {
          reject(new GeolocationError('Location access was denied.', 'permission_denied'));
        } else if (err.code === err.TIMEOUT) {
          reject(new GeolocationError('Location request timed out. Please try again.', 'timeout'));
        } else {
          reject(new GeolocationError('Could not determine your location.', 'unavailable'));
        }
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 5 * 60 * 1000 }
    );
  });

const reverseGeocode = async (latitude, longitude) => {
  const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}&zoom=10&addressdetails=1`;
  const res = await fetch(url, { headers: { Accept: 'application/json' } });

  if (!res.ok) {
    throw new GeolocationError('Could not look up your city from your location.', 'geocode_failed');
  }

  const data = await res.json();
  const address = data.address || {};
  const city =
    address.city || address.town || address.municipality || address.county || address.state_district;

  if (!city) {
    throw new GeolocationError('Could not determine your city from your location.', 'geocode_failed');
  }

  return { city, state: address.state || '', raw: address };
};

/** Detects the user's current city via browser geolocation + reverse geocoding. */
export const detectCurrentCity = async () => {
  const coords = await getCoordinates();
  return reverseGeocode(coords.latitude, coords.longitude);
};
