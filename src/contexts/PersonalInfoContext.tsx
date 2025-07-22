"use client";

import React, { createContext, useContext, useReducer, useCallback, useMemo } from 'react';
import { PersonalInfo } from '../types';

interface State {
  personal_info: PersonalInfo;
  summary: string;
}

type Action =
  | { type: 'UPDATE_PERSONAL_INFO'; payload: PersonalInfo }
  | { type: 'SET_SUMMARY'; payload: string };

const initialState: State = {
  personal_info: {
    full_name: '',
    job_title: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    website: '',
    photo_url: '',
  },
  summary: '',
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'UPDATE_PERSONAL_INFO':
      return { ...state, personal_info: action.payload };
    case 'SET_SUMMARY':
      return { ...state, summary: action.payload };
    default:
      return state;
  }
}

const PersonalInfoContext = createContext<{
  state: State;
  dispatch: React.Dispatch<Action>;
} | undefined>(undefined);

export const usePersonalInfo = () => {
  const context = useContext(PersonalInfoContext);
  if (!context) throw new Error('usePersonalInfo must be used within PersonalInfoProvider');
  return context;
};

export const PersonalInfoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = useMemo(() => ({ state, dispatch }), [state]);
  return <PersonalInfoContext.Provider value={value}>{children}</PersonalInfoContext.Provider>;
}; 