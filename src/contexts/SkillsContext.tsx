"use client";

import React, { createContext, useContext, useReducer, useCallback, useMemo } from 'react';
import { Skill } from '../types';
import { v4 as uuidv4 } from 'uuid';

interface State {
  skills: Skill[];
}

type Action =
  | { type: 'ADD_SKILL'; payload: Skill }
  | { type: 'UPDATE_SKILL'; payload: { id: string; data: Skill } }
  | { type: 'REMOVE_SKILL'; payload: string };

const initialState: State = {
  skills: [],
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'ADD_SKILL':
      return { ...state, skills: [...state.skills, action.payload] };
    case 'UPDATE_SKILL':
      return {
        ...state,
        skills: state.skills.map(skill =>
          skill.id === action.payload.id ? action.payload.data : skill
        ),
      };
    case 'REMOVE_SKILL':
      return {
        ...state,
        skills: state.skills.filter(skill => skill.id !== action.payload),
      };
    default:
      return state;
  }
}

const SkillsContext = createContext<{
  state: State;
  dispatch: React.Dispatch<Action>;
  addSkill: () => void;
} | undefined>(undefined);

export const useSkills = () => {
  const context = useContext(SkillsContext);
  if (!context) throw new Error('useSkills must be used within SkillsProvider');
  return context;
};

export const SkillsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const addSkill = useCallback(() => {
    const newSkill: Skill = {
      id: uuidv4(),
      name: '',
      level: 'intermediate',
      category: 'technical',
    };
    dispatch({ type: 'ADD_SKILL', payload: newSkill });
  }, []);
  const value = useMemo(() => ({ state, dispatch, addSkill }), [state, addSkill]);
  return <SkillsContext.Provider value={value}>{children}</SkillsContext.Provider>;
}; 