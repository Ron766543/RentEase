import { createContext, useContext, useEffect, useReducer, useCallback } from 'react';
import api from '../lib/api.jsx';
import { authReducer, initialAuthState, AUTH_ACTIONS } from './authReducer.jsx';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialAuthState);

  const fetchMe = useCallback(async () => {
    try {
      const { data } = await api.get('/auth/me');
      dispatch({ type: AUTH_ACTIONS.SESSION_RESOLVED, payload: data.user });
    } catch {
      dispatch({ type: AUTH_ACTIONS.SESSION_RESOLVED, payload: null });
    }
  }, []);

  useEffect(() => {
    (() => {
      fetchMe();
    })();
  }, [fetchMe]);

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    dispatch({ type: AUTH_ACTIONS.LOGIN_SUCCESS, payload: data.user });
    return data.user;
  };

  const register = async (payload) => {
    const { data } = await api.post('/auth/register', payload);
    dispatch({ type: AUTH_ACTIONS.LOGIN_SUCCESS, payload: data.user });
    return data.user;
  };

  const logout = async () => {
    await api.post('/auth/logout');
    dispatch({ type: AUTH_ACTIONS.LOGOUT });
  };

  const updateUser = (patch) => dispatch({ type: AUTH_ACTIONS.UPDATE_USER, payload: patch });

  return (
    <AuthContext.Provider
      value={{
        user: state.user,
        loading: state.loading,
        login,
        register,
        logout,
        updateUser,
        refresh: fetchMe,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
