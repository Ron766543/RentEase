// Action type constants for the auth reducer.
export const AUTH_ACTIONS = {
  SESSION_LOADING: 'SESSION_LOADING',
  SESSION_RESOLVED: 'SESSION_RESOLVED',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGOUT: 'LOGOUT',
  UPDATE_USER: 'UPDATE_USER',
};

export const initialAuthState = {
  user: null,
  loading: true,
};

export const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_ACTIONS.SESSION_LOADING:
      return { ...state, loading: true };

    case AUTH_ACTIONS.SESSION_RESOLVED:
      return { ...state, user: action.payload, loading: false };

    case AUTH_ACTIONS.LOGIN_SUCCESS:
      return { ...state, user: action.payload, loading: false };

    case AUTH_ACTIONS.LOGOUT:
      return { ...state, user: null, loading: false };

    case AUTH_ACTIONS.UPDATE_USER:
      return { ...state, user: { ...state.user, ...action.payload } };

    default:
      return state;
  }
};
