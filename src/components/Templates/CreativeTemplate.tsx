import React, { useCallback, useMemo } from 'react';
import { CVData } from '../../types';
import { formatDate, getSkillLevelWidth } from '../../lib/utils';
import { MapPinIcon, PhoneIcon, EnvelopeIcon, GlobeAltIcon } from '@heroicons/react/24/outline';

interface CreativeTemplateProps {
  cv: CVData;
}

export const CreativeTemplate: React.FC<CreativeTemplateProps> = ({ cv }) => {
  const experienceList = useMemo(() => cv.experience.map((exp, index) => (
    <div key={exp.id} className="relative pl-6">
      <div className={`absolute right-0 top-2 w-3 h-3 rounded-full ${
        index % 3 === 0 ? 'bg-purple-500' : index % 3 === 1 ? 'bg-pink-500' : 'bg-orange-500'
      }`}></div>
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{exp.position}</h3>
          <p className="text-purple-600 font-medium">{exp.company}</p>
        </div>
        <div className="text-right text-sm text-gray-500">
          <p>{exp.location}</p>
          <p>
            {formatDate(exp.start_date)} - {exp.current ? 'حتى الآن' : formatDate(exp.end_date)}
          </p>
        </div>
      </div>
      <p className="text-gray-700 leading-relaxed">{exp.description}</p>
    </div>
  )), [cv.experience, formatDate]);

  const educationList = useMemo(() => cv.education.map((edu) => (
    <div key={edu.id} className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{edu.degree}</h3>
          <p className="text-purple-600 font-medium">{edu.institution}</p>
        </div>
        <div className="text-right text-sm text-gray-500">
          <p>{edu.location}</p>
          <p>
            {formatDate(edu.start_date)} - {formatDate(edu.end_date)}
          </p>
          {edu.gpa && <p>المعدل: {edu.gpa}</p>}
        </div>
      </div>
    </div>
  )), [cv.education, formatDate]);

  const skillsList = useMemo(() => cv.skills.map((skill) => (
    <div key={skill.id}>
      <div className="flex justify-between items-center mb-1">
        <span className="text-gray-900 font-medium">{skill.name}</span>
        <span className="text-sm text-gray-500 capitalize">{skill.level}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={`bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300 ${getSkillLevelWidth(skill.level)}`}
        />
      </div>
    </div>
  )), [cv.skills, getSkillLevelWidth]);

  const languagesList = useMemo(() => cv.languages.map((lang) => (
    <div key={lang.id} className="bg-gradient-to-r from-purple-50 to-pink-50 p-3 rounded-lg">
      <div className="flex justify-between items-center">
        <span className="text-gray-900 font-medium">{lang.name}</span>
        <span className="text-sm text-purple-600 font-medium">{lang.level}</span>
      </div>
    </div>
  )), [cv.languages]);

  return (
    <div className="max-w-[210mm] mx-auto bg-white shadow-lg" style={{ minHeight: '297mm' }}>
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 text-white p-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">{cv.personal_info.full_name}</h1>
            <p className="text-xl text-purple-100">{cv.personal_info.job_title}</p>
          </div>
          {cv.personal_info.photo_url && (
            <img
              src={cv.personal_info.photo_url}
              alt="صورة شخصية"
              width="112" height="112"
              className="w-28 h-28 rounded-full border-4 border-white shadow-lg"
            />
          )}
        </div>
        
        <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center space-x-2 space-x-reverse">
            <EnvelopeIcon className="h-4 w-4" />
            <span>{cv.personal_info.email}</span>
          </div>
          <div className="flex items-center space-x-2 space-x-reverse">
            <PhoneIcon className="h-4 w-4" />
            <span>{cv.personal_info.phone}</span>
          </div>
          <div className="flex items-center space-x-2 space-x-reverse">
            <MapPinIcon className="h-4 w-4" />
            <span>{cv.personal_info.location}</span>
          </div>
          {cv.personal_info.website && (
            <div className="flex items-center space-x-2 space-x-reverse">
              <GlobeAltIcon className="h-4 w-4" />
              <span className="truncate">{cv.personal_info.website}</span>
            </div>
          )}
        </div>
      </div>

      <div className="p-8 space-y-8">
        {/* Summary */}
        {cv.summary && (
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 relative">
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                نبذة شخصية
              </span>
              <div className="absolute bottom-0 left-0 w-12 h-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded"></div>
            </h2>
            <p className="text-gray-700 leading-relaxed">{cv.summary}</p>
          </section>
        )}

        {/* Experience */}
        {cv.experience.length > 0 && (
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 relative">
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                الخبرات المهنية
              </span>
              <div className="absolute bottom-0 left-0 w-12 h-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded"></div>
            </h2>
            <div className="space-y-6">
              {experienceList}
            </div>
          </section>
        )}

        {/* Education */}
        {cv.education.length > 0 && (
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 relative">
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                التعليم
              </span>
              <div className="absolute bottom-0 left-0 w-12 h-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded"></div>
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
              <h2 className="text-xl font-bold text-gray-900 mb-4 relative">
                <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  المهارات
                </span>
                <div className="absolute bottom-0 left-0 w-12 h-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded"></div>
              </h2>
              <div className="space-y-3">
                {skillsList}
              </div>
            </section>
          )}

          {/* Languages */}
          {cv.languages.length > 0 && (
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4 relative">
                <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  اللغات
                </span>
                <div className="absolute bottom-0 left-0 w-12 h-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded"></div>
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