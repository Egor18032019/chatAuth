// AuthProvider.js
import React from 'react'
import { createContext, useReducer } from 'react';
import { authReducer, initialState } from '../reducers/AuthReducer';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [state, dispatch] = useReducer(authReducer, initialState);

    return (
        <AuthContext.Provider value={{ state, dispatch }}>
            {children}
        </AuthContext.Provider>
    );
}