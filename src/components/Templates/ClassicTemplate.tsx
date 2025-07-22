import React from 'react';
import { CVData } from '../../types';
import { MapPinIcon, PhoneIcon, EnvelopeIcon, GlobeAltIcon } from '@heroicons/react/24/outline';

interface ClassicTemplateProps {
  cv: CVData;
}

export const ClassicTemplate: React.FC<ClassicTemplateProps> = ({ cv }) => {
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
    <div key={exp.id} className="border-r-4 border-gray-300 pr-4">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="text-lg font-bold text-gray-900">{exp.position}</h3>
          <p className="text-gray-700 font-semibold">{exp.company}</p>
        </div>
        <div className="text-right text-sm text-gray-600">
          <p className="font-medium">{exp.location}</p>
          <p>
            {formatDate(exp.start_date)} - {exp.current ? 'حتى الآن' : formatDate(exp.end_date)}
          </p>
        </div>
      </div>
      <p className="text-gray-700 leading-relaxed text-justify">{exp.description}</p>
    </div>
  )), [cv.experience, formatDate]);

  const educationList = useMemo(() => cv.education.map((edu) => (
    <div key={edu.id} className="border-r-4 border-gray-300 pr-4">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="text-lg font-bold text-gray-900">{edu.degree}</h3>
          <p className="text-gray-700 font-semibold">{edu.institution}</p>
        </div>
        <div className="text-right text-sm text-gray-600">
          <p className="font-medium">{edu.location}</p>
          <p>
            {formatDate(edu.start_date)} - {formatDate(edu.end_date)}
          </p>
          {edu.gpa && <p>المعدل: {edu.gpa}</p>}
        </div>
      </div>
      {edu.description && (
        <p className="text-gray-700 leading-relaxed text-justify">{edu.description}</p>
      )}
    </div>
  )), [cv.education, formatDate]);

  const skillsList = useMemo(() => cv.skills.map((skill) => (
    <div key={skill.id} className="flex justify-between items-center py-1">
      <span className="text-gray-900 font-medium">{skill.name}</span>
      <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
        {skill.level}
      </span>
    </div>
  )), [cv.skills]);

  const languagesList = useMemo(() => cv.languages.map((lang) => (
    <div key={lang.id} className="flex justify-between items-center py-1">
      <span className="text-gray-900 font-medium">{lang.name}</span>
      <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
        {getLanguageLevelText(lang.level)}
      </span>
    </div>
  )), [cv.languages, getLanguageLevelText]);

  return (
    <div className="max-w-[210mm] mx-auto bg-white shadow-lg" style={{ minHeight: '297mm' }}>
      {/* Header */}
      <div className="border-b-4 border-gray-800 p-8">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">{cv.personal_info.full_name}</h1>
            <p className="text-xl text-gray-600 font-medium">{cv.personal_info.job_title}</p>
          </div>
          {cv.personal_info.photo_url && (
            <img
              src={cv.personal_info.photo_url}
              alt="صورة شخصية"
              width="112" height="112"
              className="w-28 h-28 rounded-lg border-2 border-gray-300 shadow-md mr-6"
            />
          )}
        </div>
        
        <div className="mt-6 grid grid-cols-2 gap-4 text-sm text-gray-700">
          <div className="flex items-center space-x-2 space-x-reverse">
            <EnvelopeIcon className="h-4 w-4 text-gray-500" />
            <span>{cv.personal_info.email}</span>
          </div>
          <div className="flex items-center space-x-2 space-x-reverse">
            <PhoneIcon className="h-4 w-4 text-gray-500" />
            <span>{cv.personal_info.phone}</span>
          </div>
          <div className="flex items-center space-x-2 space-x-reverse">
            <MapPinIcon className="h-4 w-4 text-gray-500" />
            <span>{cv.personal_info.location}</span>
          </div>
          {cv.personal_info.website && (
            <div className="flex items-center space-x-2 space-x-reverse">
              <GlobeAltIcon className="h-4 w-4 text-gray-500" />
              <span className="truncate">{cv.personal_info.website}</span>
            </div>
          )}
        </div>
      </div>

      <div className="p-8 space-y-8">
        {/* Summary */}
        {cv.summary && (
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 uppercase tracking-wide">
              نبذة شخصية
            </h2>
            <p className="text-gray-700 leading-relaxed text-justify">{cv.summary}</p>
          </section>
        )}

        {/* Experience */}
        {cv.experience.length > 0 && (
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 uppercase tracking-wide">
              الخبرات المهنية
            </h2>
            <div className="space-y-6">
              {experienceList}
            </div>
          </section>
        )}

        {/* Education */}
        {cv.education.length > 0 && (
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 uppercase tracking-wide">
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
              <h2 className="text-xl font-bold text-gray-900 mb-4 uppercase tracking-wide">
                المهارات
              </h2>
              <div className="space-y-2">
                {skillsList}
              </div>
            </section>
          )}

          {/* Languages */}
          {cv.languages.length > 0 && (
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4 uppercase tracking-wide">
                اللغات
              </h2>
              <div className="space-y-2">
                {languagesList}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};