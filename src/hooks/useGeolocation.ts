import { useState, useCallback } from 'react';

export interface GeolocationState {
  lat: number | null;
  lng: number | null;
  error: string | null;
  loading: boolean;
}

export function useGeolocation() {
  // Default fallback center: MP Nagar, Bhopal
  const DEFAULT_LAT = 23.2332;
  const DEFAULT_LNG = 77.4345;

  const [state, setState] = useState<GeolocationState>({
    lat: null,
    lng: null,
    error: null,
    loading: false,
  });

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setState({
        lat: DEFAULT_LAT,
        lng: DEFAULT_LNG,
        error: 'Geolocation is not supported by your browser.',
        loading: false,
      });
      return;
    }

    setState((prev) => ({ ...prev, loading: true, error: null }));

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setState({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          error: null,
          loading: false,
        });
      },
      (error) => {
        let msg = 'Location access was not available.';
        if (error.code === error.PERMISSION_DENIED) {
          msg = 'Location access permission denied.';
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          msg = 'Location position unavailable.';
        } else if (error.code === error.TIMEOUT) {
          msg = 'Location request timed out.';
        }

        setState({
          lat: DEFAULT_LAT,
          lng: DEFAULT_LNG,
          error: msg,
          loading: false,
        });
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  }, []);

  return {
    ...state,
    requestLocation,
    defaultLat: DEFAULT_LAT,
    defaultLng: DEFAULT_LNG,
  };
}
