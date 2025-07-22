"use client";

import React, { createContext, useContext, useReducer, useCallback, useMemo } from 'react';
import { Language } from '../types';
import { v4 as uuidv4 } from 'uuid';

interface State {
  languages: Language[];
}

type Action =
  | { type: 'ADD_LANGUAGE'; payload: Language }
  | { type: 'UPDATE_LANGUAGE'; payload: { id: string; data: Language } }
  | { type: 'REMOVE_LANGUAGE'; payload: string };

const initialState: State = {
  languages: [],
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'ADD_LANGUAGE':
      return { ...state, languages: [...state.languages, action.payload] };
    case 'UPDATE_LANGUAGE':
      return {
        ...state,
        languages: state.languages.map(lang =>
          lang.id === action.payload.id ? action.payload.data : lang
        ),
      };
    case 'REMOVE_LANGUAGE':
      return {
        ...state,
        languages: state.languages.filter(lang => lang.id !== action.payload),
      };
    default:
      return state;
  }
}

const LanguagesContext = createContext<{
  state: State;
  dispatch: React.Dispatch<Action>;
  addLanguage: () => void;
} | undefined>(undefined);

export const useLanguages = () => {
  const context = useContext(LanguagesContext);
  if (!context) throw new Error('useLanguages must be used within LanguagesProvider');
  return context;
};

export const LanguagesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const addLanguage = useCallback(() => {
    const newLanguage: Language = {
      id: uuidv4(),
      name: '',
      level: 'conversational',
    };
    dispatch({ type: 'ADD_LANGUAGE', payload: newLanguage });
  }, []);
  const value = useMemo(() => ({ state, dispatch, addLanguage }), [state, addLanguage]);
  return <LanguagesContext.Provider value={value}>{children}</LanguagesContext.Provider>;
}; 