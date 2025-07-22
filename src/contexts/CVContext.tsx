"use client";

import React, { createContext, useContext, useReducer, useEffect, useCallback, useMemo } from 'react';
import { CVData, PersonalInfo, Education, Experience, Skill, Language } from '../types';
import { v4 as uuidv4 } from 'uuid';

type CVAction =
  | { type: 'UPDATE_PERSONAL_INFO'; payload: PersonalInfo }
  | { type: 'SET_SUMMARY'; payload: string }
  | { type: 'ADD_EDUCATION'; payload: Education }
  | { type: 'UPDATE_EDUCATION'; payload: { id: string; data: Education } }
  | { type: 'REMOVE_EDUCATION'; payload: string }
  | { type: 'ADD_EXPERIENCE'; payload: Experience }
  | { type: 'UPDATE_EXPERIENCE'; payload: { id: string; data: Experience } }
  | { type: 'REMOVE_EXPERIENCE'; payload: string }
  | { type: 'ADD_SKILL'; payload: Skill }
  | { type: 'UPDATE_SKILL'; payload: { id: string; data: Skill } }
  | { type: 'REMOVE_SKILL'; payload: string }
  | { type: 'ADD_LANGUAGE'; payload: Language }
  | { type: 'UPDATE_LANGUAGE'; payload: { id: string; data: Language } }
  | { type: 'REMOVE_LANGUAGE'; payload: string }
  | { type: 'SET_TEMPLATE'; payload: string }
  | { type: 'LOAD_CV'; payload: CVData }
  | { type: 'RESET_CV' };

const initialState: CVData = {
  user_id: '',
  title: 'السيرة الذاتية الجديدة',
  template_id: 'modern-arabic',
  personal_info: {
    full_name: '',
    job_title: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    website: '',
  },
  education: [],
  experience: [],
  skills: [],
  languages: [],
  summary: '',
};

const cvReducer = (state: CVData, action: CVAction): CVData => {
  switch (action.type) {
    case 'UPDATE_PERSONAL_INFO':
      return { ...state, personal_info: action.payload };
    case 'SET_SUMMARY':
      return { ...state, summary: action.payload };
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
    case 'SET_TEMPLATE':
      return { ...state, template_id: action.payload };
    case 'LOAD_CV':
      return action.payload;
    case 'RESET_CV':
      return initialState;
    default:
      return state;
  }
};

interface CVContextType {
  cv: CVData;
  dispatch: React.Dispatch<CVAction>;
  addEducation: () => void;
  addExperience: () => void;
  addSkill: () => void;
  addLanguage: () => void;
}

const CVContext = createContext<CVContextType | undefined>(undefined);

export const useCV = () => {
  const context = useContext(CVContext);
  if (!context) {
    throw new Error('useCV must be used within a CVProvider');
  }
  return context;
};

export const CVProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cv, dispatch] = useReducer(cvReducer, initialState);

  // Memoized action creators to prevent unnecessary re-renders
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

  const addSkill = useCallback(() => {
    const newSkill: Skill = {
      id: uuidv4(),
      name: '',
      level: 'intermediate',
      category: 'technical',
    };
    dispatch({ type: 'ADD_SKILL', payload: newSkill });
  }, []);

  const addLanguage = useCallback(() => {
    const newLanguage: Language = {
      id: uuidv4(),
      name: '',
      level: 'conversational',
    };
    dispatch({ type: 'ADD_LANGUAGE', payload: newLanguage });
  }, []);

  // Memoized context value to prevent unnecessary re-renders
  const value = useMemo(() => ({
    cv,
    dispatch,
    addEducation,
    addExperience,
    addSkill,
    addLanguage,
  }), [cv, addEducation, addExperience, addSkill, addLanguage]);

  return <CVContext.Provider value={value}>{children}</CVContext.Provider>;
};