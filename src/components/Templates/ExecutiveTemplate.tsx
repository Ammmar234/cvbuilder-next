import React, { useMemo, useCallback } from 'react';
import { CVData } from '../../types';
import { MapPinIcon, PhoneIcon, EnvelopeIcon, GlobeAltIcon } from '@heroicons/react/24/outline';

interface ExecutiveTemplateProps {
  cv: CVData;
}

export const ExecutiveTemplate: React.FC<ExecutiveTemplateProps> = ({ cv }) => {
  const formatDate = useCallback((dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-SA', { year: 'numeric', month: 'long' });
  }, []);

  const getLanguageLevelText = useCallback((level: string) => {
    switch (level) {
      case 'basic': return 'أساسي';
      case 'conversational': return 'محادثة';
      case 'fluent': return 'طلاقة';
      case 'native': return 'لغة أم';
      default: return 'متوسط';
    }
  }, []);

  const experienceList = useMemo(() => cv.experience.map((exp) => (
    <div key={exp.id} className="bg-gray-50 p-6 rounded-lg shadow-sm">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-1">{exp.position}</h3>
          <p className="text-lg text-yellow-600 font-semibold">{exp.company}</p>
        </div>
        <div className="text-right text-gray-600">
          <p className="font-medium">{exp.location}</p>
          <p className="text-sm">
            {formatDate(exp.start_date)} - {exp.current ? 'حتى الآن' : formatDate(exp.end_date)}
          </p>
        </div>
      </div>
      <p className="text-gray-700 leading-relaxed text-justify">{exp.description}</p>
    </div>
  )), [cv.experience, formatDate]);

  const educationList = useMemo(() => cv.education.map((edu) => (
    <div key={edu.id} className="bg-gray-50 p-6 rounded-lg shadow-sm">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="text-xl font-bold text-gray-900">{edu.degree}</h3>
          <p className="text-lg text-yellow-600 font-semibold">{edu.institution}</p>
        </div>
        <div className="text-right text-gray-600">
          <p className="font-medium">{edu.location}</p>
          <p className="text-sm">
            {formatDate(edu.start_date)} - {formatDate(edu.end_date)}
          </p>
          {edu.gpa && <p className="text-sm">المعدل: {edu.gpa}</p>}
        </div>
      </div>
      {edu.description && (
        <p className="text-gray-700 leading-relaxed text-justify">{edu.description}</p>
      )}
    </div>
  )), [cv.education, formatDate]);

  const skillsList = useMemo(() => cv.skills.map((skill) => (
    <div key={skill.id} className="bg-gray-50 p-3 rounded-lg">
      <div className="flex justify-between items-center">
        <span className="text-gray-900 font-semibold">{skill.name}</span>
        <span className="text-sm text-yellow-600 font-medium bg-yellow-100 px-2 py-1 rounded">
          {skill.level}
        </span>
      </div>
    </div>
  )), [cv.skills]);

  const languagesList = useMemo(() => cv.languages.map((lang) => (
    <div key={lang.id} className="bg-gray-50 p-3 rounded-lg">
      <div className="flex justify-between items-center">
        <span className="text-gray-900 font-semibold">{lang.name}</span>
        <span className="text-sm text-yellow-600 font-medium bg-yellow-100 px-2 py-1 rounded">
          {getLanguageLevelText(lang.level)}
        </span>
      </div>
    </div>
  )), [cv.languages, getLanguageLevelText]);

  return (
    <div className="max-w-[210mm] mx-auto bg-white shadow-lg" style={{ minHeight: '297mm' }}>
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-700 text-white p-8">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h1 className="text-4xl font-bold mb-3 tracking-wide">{cv.personal_info.full_name}</h1>
            <p className="text-xl text-gray-200 font-light tracking-wide">{cv.personal_info.job_title}</p>
            <div className="mt-4 w-20 h-1 bg-gradient-to-r from-yellow-400 to-yellow-600"></div>
          </div>
          {cv.personal_info.photo_url && (
            <img
              src={cv.personal_info.photo_url}
              alt="صورة شخصية"
              width="128" height="128"
              className="w-32 h-32 rounded-lg border-4 border-yellow-400 shadow-xl mr-8"
            />
          )}
        </div>
        
        <div className="mt-8 grid grid-cols-2 gap-6 text-sm">
          <div className="flex items-center space-x-3 space-x-reverse">
            <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
              <EnvelopeIcon className="h-4 w-4 text-gray-900" />
            </div>
            <span className="text-gray-200">{cv.personal_info.email}</span>
          </div>
          <div className="flex items-center space-x-3 space-x-reverse">
            <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
              <PhoneIcon className="h-4 w-4 text-gray-900" />
            </div>
            <span className="text-gray-200">{cv.personal_info.phone}</span>
          </div>
          <div className="flex items-center space-x-3 space-x-reverse">
            <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
              <MapPinIcon className="h-4 w-4 text-gray-900" />
            </div>
            <span className="text-gray-200">{cv.personal_info.location}</span>
          </div>
          {cv.personal_info.website && (
            <div className="flex items-center space-x-3 space-x-reverse">
              <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                <GlobeAltIcon className="h-4 w-4 text-gray-900" />
              </div>
              <span className="text-gray-200 truncate">{cv.personal_info.website}</span>
            </div>
          )}
        </div>
      </div>

      <div className="p-10 space-y-10">
        {/* Summary */}
        {cv.summary && (
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 relative">
              نبذة تنفيذية
              <div className="absolute bottom-0 left-0 w-16 h-1 bg-gradient-to-r from-yellow-400 to-yellow-600"></div>
            </h2>
            <p className="text-gray-700 leading-relaxed text-lg text-justify">{cv.summary}</p>
          </section>
        )}

        {/* Experience */}
        {cv.experience.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 relative">
              الخبرات المهنية
              <div className="absolute bottom-0 left-0 w-16 h-1 bg-gradient-to-r from-yellow-400 to-yellow-600"></div>
            </h2>
            <div className="space-y-8">
              {experienceList}
            </div>
          </section>
        )}

        {/* Education */}
        {cv.education.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 relative">
              التعليم
              <div className="absolute bottom-0 left-0 w-16 h-1 bg-gradient-to-r from-yellow-400 to-yellow-600"></div>
            </h2>
            <div className="space-y-6">
              {educationList}
            </div>
          </section>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Skills */}
          {cv.skills.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 relative">
                المهارات الأساسية
                <div className="absolute bottom-0 left-0 w-16 h-1 bg-gradient-to-r from-yellow-400 to-yellow-600"></div>
              </h2>
              <div className="space-y-3">
                {skillsList}
              </div>
            </section>
          )}

          {/* Languages */}
          {cv.languages.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 relative">
                اللغات
                <div className="absolute bottom-0 left-0 w-16 h-1 bg-gradient-to-r from-yellow-400 to-yellow-600"></div>
              </h2>
              <div className="space-y-3">
                {languagesList}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};