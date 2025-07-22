"use client";

import React, { createContext, useContext, useReducer, useCallback, useMemo } from 'react';
import { Education } from '../types';
import { v4 as uuidv4 } from 'uuid';

interface State {
  education: Education[];
}

type Action =
  | { type: 'ADD_EDUCATION'; payload: Education }
  | { type: 'UPDATE_EDUCATION'; payload: { id: string; data: Education } }
  | { type: 'REMOVE_EDUCATION'; payload: string };

const initialState: State = {
  education: [],
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'ADD_EDUCATION':
      return { ...state, education: [...state.education, action.payload] };
    case 'UPDATE_EDUCATION':
      return {
        ...state,
        education: state.education.map(edu =>
          edu.id === action.payload.id ? action.payload.data : edu
        ),
      };
    case 'REMOVE_EDUCATION':
      return {
        ...state,
        education: state.education.filter(edu => edu.id !== action.payload),
      };
    default:
      return state;
  }
}

const EducationContext = createContext<{
  state: State;
  dispatch: React.Dispatch<Action>;
  addEducation: () => void;
} | undefined>(undefined);

export const useEducation = () => {
  const context = useContext(EducationContext);
  if (!context) throw new Error('useEducation must be used within EducationProvider');
  return context;
};

export const EducationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const addEducation = useCallback(() => {
    const newEducation: Education = {
      id: uuidv4(),
      degree: '',
      institution: '',
      location: '',
      start_date: '',
      end_date: '',
      gpa: '',
      description: '',
    };
    dispatch({ type: 'ADD_EDUCATION', payload: newEducation });
  }, []);
  const value = useMemo(() => ({ state, dispatch, addEducation }), [state, addEducation]);
  return <EducationContext.Provider value={value}>{children}</EducationContext.Provider>;
}; 