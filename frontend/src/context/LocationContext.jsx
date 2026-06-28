import { createContext, useContext, useReducer, useEffect } from 'react';
import { locationReducer, initialLocationState, LOCATION_ACTIONS, SERVICEABLE_CITIES } from './locationReducer.jsx';

export { SERVICEABLE_CITIES };

const STORAGE_KEY = 'rentease-location';
const LocationContext = createContext(null);

const loadStoredState = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return initialLocationState;
    const parsed = JSON.parse(raw);
    return { ...initialLocationState, ...parsed };
  } catch {
    return initialLocationState;
  }
};

export const LocationProvider = ({ children }) => {
  const [state, dispatch] = useReducer(locationReducer, initialLocationState, loadStoredState);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const setCity = (city, source = 'manual') => dispatch({ type: LOCATION_ACTIONS.SET_CITY, payload: { city, source } });
  const clearCity = () => dispatch({ type: LOCATION_ACTIONS.CLEAR_CITY });

  return (
    <LocationContext.Provider value={{ ...state, setCity, clearCity }}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocationContext = () => {
  const ctx = useContext(LocationContext);
  if (!ctx) throw new Error('useLocationContext must be used within LocationProvider');
  return ctx;
};
