"use client";

import React, { createContext, useContext, useReducer, useCallback, useMemo } from 'react';
import { Experience } from '../types';
import { v4 as uuidv4 } from 'uuid';

interface State {
  experience: Experience[];
}

type Action =
  | { type: 'ADD_EXPERIENCE'; payload: Experience }
  | { type: 'UPDATE_EXPERIENCE'; payload: { id: string; data: Experience } }
  | { type: 'REMOVE_EXPERIENCE'; payload: string };

const initialState: State = {
  experience: [],
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'ADD_EXPERIENCE':
      return { ...state, experience: [...state.experience, action.payload] };
    case 'UPDATE_EXPERIENCE':
      return {
        ...state,
        experience: state.experience.map(exp =>
          exp.id === action.payload.id ? action.payload.data : exp
        ),
      };
    case 'REMOVE_EXPERIENCE':
      return {
        ...state,
        experience: state.experience.filter(exp => exp.id !== action.payload),
      };
    default:
      return state;
  }
}

const ExperienceContext = createContext<{
  state: State;
  dispatch: React.Dispatch<Action>;
  addExperience: () => void;
} | undefined>(undefined);

export const useExperience = () => {
  const context = useContext(ExperienceContext);
  if (!context) throw new Error('useExperience must be used within ExperienceProvider');
  return context;
};

export const ExperienceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const addExperience = useCallback(() => {
    const newExperience: Experience = {
      id: uuidv4(),
      position: '',
      company: '',
      location: '',
      start_date: '',
      end_date: '',
      current: false,
      description: '',
    };
    dispatch({ type: 'ADD_EXPERIENCE', payload: newExperience });
  }, []);
  const value = useMemo(() => ({ state, dispatch, addExperience }), [state, addExperience]);
  return <ExperienceContext.Provider value={value}>{children}</ExperienceContext.Provider>;
}; 