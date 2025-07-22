export interface User {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  plan: 'free' | 'premium';
  created_at: string;
}

export interface CVData {
  id?: string;
  user_id: string;
  title: string;
  template_id: string;
  personal_info: PersonalInfo;
  education: Education[];
  experience: Experience[];
  skills: Skill[];
  languages: Language[];
  summary: string;
  created_at?: string;
  updated_at?: string;
}

export interface PersonalInfo {
  full_name: string;
  job_title: string;
  email: string;
  phone: string;
  location: string;
  linkedin?: string;
  website?: string;
  photo_url?: string;
}

export interface Education {
  id: string;
  degree: string;
  institution: string;
  location: string;
  start_date: string;
  end_date: string;
  gpa?: string;
  description?: string;
}

export interface Experience {
  id: string;
  position: string;
  company: string;
  location: string;
  start_date: string;
  end_date: string;
  current: boolean;
  description: string;
}

export interface Skill {
  id: string;
  name: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  category: 'technical' | 'soft' | 'language' | 'other';
}

export interface Language {
  id: string;
  name: string;
  level: 'basic' | 'conversational' | 'fluent' | 'native';
}

export interface Template {
  id: string;
  name: string;
  category: 'modern' | 'classic' | 'minimalist' | 'creative' | 'professional';
  premium: boolean;
  preview_url: string;
  description: string;
}

export interface UserPlan {
  type: 'free' | 'premium';
  expires_at?: string;
}