import React, { useCallback, useMemo, useState, useEffect } from 'react';
import { CVData } from '../../types';
import { MapPinIcon, PhoneIcon, EnvelopeIcon, GlobeAltIcon } from '@heroicons/react/24/outline';

interface ModernArabicTemplateProps {
  cv: CVData;
}

export const ModernArabicTemplate: React.FC<ModernArabicTemplateProps> = ({ cv }) => {
  const getSkillLevelWidth = useCallback((level: string) => {
    switch (level) {
      case 'beginner': return 'w-1/4';
      case 'intermediate': return 'w-1/2';
      case 'advanced': return 'w-3/4';
      case 'expert': return 'w-full';
      default: return 'w-1/2';
    }
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

  const formatDate = (dateString: string) => {
    const [formatted, setFormatted] = useState('');
    useEffect(() => {
      if (!dateString) return setFormatted('');
      setFormatted(new Date(dateString).toLocaleDateString('ar-SA', { year: 'numeric', month: 'long' }));
    }, [dateString]);
    return formatted;
  };

  const experienceList = useMemo(() => (
    cv.experience.map((exp) => (
      <div key={exp.id} className="relative">
        <div className="flex flex-col sm:flex-row justify-between items-start mb-2">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{exp.position}</h3>
            <p className="text-blue-600 font-medium">{exp.company}</p>
          </div>
          <div className="text-right text-sm text-gray-500 mt-2 sm:mt-0">
            <p>{exp.location}</p>
            <p>
              {formatDate(exp.start_date)} - {exp.current ? 'حتى الآن' : formatDate(exp.end_date)}
            </p>
          </div>
        </div>
        <p className="text-gray-700 leading-relaxed">{exp.description}</p>
      </div>
    ))
  ), [cv.experience, formatDate]);

  const educationList = useMemo(() => (
    cv.education.map((edu) => (
      <div key={edu.id} className="relative">
        <div className="flex flex-col sm:flex-row justify-between items-start mb-2">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{edu.degree}</h3>
            <p className="text-blue-600 font-medium">{edu.institution}</p>
          </div>
          <div className="text-right text-sm text-gray-500 mt-2 sm:mt-0">
            <p>{edu.location}</p>
            <p>
              {formatDate(edu.start_date)} - {formatDate(edu.end_date)}
            </p>
            {edu.gpa && <p>المعدل: {edu.gpa}</p>}
          </div>
        </div>
        {edu.description && (
          <p className="text-gray-700 leading-relaxed">{edu.description}</p>
        )}
      </div>
    ))
  ), [cv.education, formatDate]);

  const skillsList = useMemo(() => (
    cv.skills.map((skill) => (
      <div key={skill.id}>
        <div className="flex justify-between items-center mb-1">
          <span className="text-gray-900 font-medium">{skill.name}</span>
          <span className="text-sm text-gray-500 capitalize">{skill.level}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`bg-blue-600 h-2 rounded-full transition-all duration-300 ${getSkillLevelWidth(skill.level)}`}
          />
        </div>
      </div>
    ))
  ), [cv.skills, getSkillLevelWidth]);

  const languagesList = useMemo(() => (
    cv.languages.map((lang) => (
      <div key={lang.id} className="flex justify-between items-center">
        <span className="text-gray-900 font-medium">{lang.name}</span>
        <span className="text-sm text-gray-500">{getLanguageLevelText(lang.level)}</span>
      </div>
    ))
  ), [cv.languages, getLanguageLevelText]);

  return (
    <div className="max-w-[210mm] mx-auto bg-white shadow-lg min-h-[297mm] px-2 sm:px-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-4 sm:p-8 rounded-b-lg">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl sm:text-3xl font-bold mb-2 truncate">{cv.personal_info.full_name}</h1>
            <p className="text-lg sm:text-xl text-blue-100 truncate">{cv.personal_info.job_title}</p>
          </div>
          {cv.personal_info.photo_url && (
            <img
              src={cv.personal_info.photo_url}
              alt="صورة شخصية"
              loading="lazy"
              width="96" height="96"
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-white shadow-lg object-cover"
              style={{ maxWidth: 96, maxHeight: 96 }}
            />
          )}
        </div>
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 text-sm">
          <div className="flex items-center space-x-2 space-x-reverse">
            <EnvelopeIcon className="h-4 w-4" />
            <span className="truncate">{cv.personal_info.email}</span>
          </div>
          <div className="flex items-center space-x-2 space-x-reverse">
            <PhoneIcon className="h-4 w-4" />
            <span className="truncate">{cv.personal_info.phone}</span>
          </div>
          <div className="flex items-center space-x-2 space-x-reverse">
            <MapPinIcon className="h-4 w-4" />
            <span className="truncate">{cv.personal_info.location}</span>
          </div>
          {cv.personal_info.website && (
            <div className="flex items-center space-x-2 space-x-reverse">
              <GlobeAltIcon className="h-4 w-4" />
              <span className="truncate">{cv.personal_info.website}</span>
            </div>
          )}
        </div>
      </div>
      <div className="p-2 sm:p-8 space-y-8">
        {/* Summary */}
        {cv.summary && (
          <section>
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 border-b-2 border-blue-600 pb-2">
              نبذة شخصية
            </h2>
            <p className="text-gray-700 leading-relaxed">{cv.summary}</p>
          </section>
        )}
        {/* Experience */}
        {cv.experience.length > 0 && (
          <section>
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">
              الخبرات المهنية
            </h2>
            <div className="space-y-4">
              {experienceList}
            </div>
          </section>
        )}
        {/* Education */}
        {cv.education.length > 0 && (
          <section>
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">
              التعليم
            </h2>
            <div className="space-y-4">
              {educationList}
            </div>
          </section>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Skills */}
          {cv.skills.length > 0 && (
            <section>
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">
                المهارات
              </h2>
              <div className="space-y-3">
                {skillsList}
              </div>
            </section>
          )}
          {/* Languages */}
          {cv.languages.length > 0 && (
            <section>
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">
                اللغات
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