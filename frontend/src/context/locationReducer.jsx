export const SERVICEABLE_CITIES = ['Bengaluru', 'Hyderabad', 'Pune'];

export const LOCATION_ACTIONS = {
  SET_CITY: 'SET_CITY',
  CLEAR_CITY: 'CLEAR_CITY',
  HYDRATE: 'HYDRATE',
};

export const initialLocationState = {
  city: '',
  source: null,
  isServiceable: true,
};

export const locationReducer = (state, action) => {
  switch (action.type) {
    case LOCATION_ACTIONS.HYDRATE:
      return action.payload || state;

    case LOCATION_ACTIONS.SET_CITY: {
      const { city, source = 'manual' } = action.payload;
      return {
        city,
        source,
        isServiceable: !city || SERVICEABLE_CITIES.includes(city),
      };
    }

    case LOCATION_ACTIONS.CLEAR_CITY:
      return initialLocationState;

    default:
      return state;
  }
};
