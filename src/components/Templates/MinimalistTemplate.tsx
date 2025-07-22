import React, { useMemo, useCallback } from 'react';
import { CVData } from '../../types';

interface MinimalistTemplateProps {
  cv: CVData;
}

export const MinimalistTemplate: React.FC<MinimalistTemplateProps> = ({ cv }) => {
  const formatDate = useCallback((dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-SA', { year: 'numeric', month: 'short' });
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
    <div key={exp.id}>
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="font-medium text-gray-900">{exp.position}</h3>
          <p className="text-gray-600">{exp.company}</p>
        </div>
        <div className="text-right text-sm text-gray-500">
          <p>{formatDate(exp.start_date)} - {exp.current ? 'حتى الآن' : formatDate(exp.end_date)}</p>
          <p>{exp.location}</p>
        </div>
      </div>
      <p className="text-gray-700 text-sm leading-relaxed">{exp.description}</p>
    </div>
  )), [cv.experience, formatDate]);

  const educationList = useMemo(() => cv.education.map((edu) => (
    <div key={edu.id}>
      <div className="flex justify-between items-start mb-1">
        <div>
          <h3 className="font-medium text-gray-900">{edu.degree}</h3>
          <p className="text-gray-600">{edu.institution}</p>
        </div>
        <div className="text-right text-sm text-gray-500">
          <p>{formatDate(edu.start_date)} - {formatDate(edu.end_date)}</p>
          {edu.gpa && <p>المعدل: {edu.gpa}</p>}
        </div>
      </div>
    </div>
  )), [cv.education, formatDate]);

  const skillsList = useMemo(() => cv.skills.map((skill) => (
    <div key={skill.id} className="text-sm">
      <span className="text-gray-900">{skill.name}</span>
    </div>
  )), [cv.skills]);

  const languagesList = useMemo(() => cv.languages.map((lang) => (
    <div key={lang.id} className="flex justify-between text-sm">
      <span className="text-gray-900">{lang.name}</span>
      <span className="text-gray-600">{getLanguageLevelText(lang.level)}</span>
    </div>
  )), [cv.languages, getLanguageLevelText]);

  return (
    <div className="max-w-[210mm] mx-auto bg-white shadow-lg" style={{ minHeight: '297mm' }}>
      <div className="p-12 space-y-10">
        {/* Header */}
        <div className="text-center border-b border-gray-200 pb-8">
          {cv.personal_info.photo_url && (
            <img
              src={cv.personal_info.photo_url}
              alt="صورة شخصية"
              width="96" height="96"
              className="w-24 h-24 rounded-full mx-auto mb-4 border border-gray-200"
            />
          )}
          <h1 className="text-3xl font-light text-gray-900 mb-2">{cv.personal_info.full_name}</h1>
          <p className="text-lg text-gray-600 mb-4">{cv.personal_info.job_title}</p>
          
          <div className="flex justify-center items-center space-x-6 space-x-reverse text-sm text-gray-600">
            <span>{cv.personal_info.email}</span>
            <span>•</span>
            <span>{cv.personal_info.phone}</span>
            <span>•</span>
            <span>{cv.personal_info.location}</span>
          </div>
        </div>

        {/* Summary */}
        {cv.summary && (
          <section>
            <h2 className="text-lg font-medium text-gray-900 mb-4">نبذة شخصية</h2>
            <p className="text-gray-700 leading-relaxed text-justify">{cv.summary}</p>
          </section>
        )}

        {/* Experience */}
        {cv.experience.length > 0 && (
          <section>
            <h2 className="text-lg font-medium text-gray-900 mb-6">الخبرات المهنية</h2>
            <div className="space-y-6">
              {experienceList}
            </div>
          </section>
        )}

        {/* Education */}
        {cv.education.length > 0 && (
          <section>
            <h2 className="text-lg font-medium text-gray-900 mb-6">التعليم</h2>
            <div className="space-y-4">
              {educationList}
            </div>
          </section>
        )}

        <div className="grid grid-cols-2 gap-12">
          {/* Skills */}
          {cv.skills.length > 0 && (
            <section>
              <h2 className="text-lg font-medium text-gray-900 mb-4">المهارات</h2>
              <div className="space-y-2">
                {skillsList}
              </div>
            </section>
          )}

          {/* Languages */}
          {cv.languages.length > 0 && (
            <section>
              <h2 className="text-lg font-medium text-gray-900 mb-4">اللغات</h2>
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