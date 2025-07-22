import React, { useCallback, useMemo, memo } from 'react';
import { useExperience } from '../../contexts/ExperienceContext';
import { Experience } from '../../types';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';

export const ExperienceForm: React.FC = memo(() => {
  const { state, dispatch, addExperience } = useExperience();

  const updateExperience = useCallback((id: string, field: keyof Experience, value: string | boolean) => {
    const experience = state.experience.find(exp => exp.id === id);
    if (experience) {
      const updatedExperience = { ...experience, [field]: value };
      dispatch({ type: 'UPDATE_EXPERIENCE', payload: { id, data: updatedExperience } });
    }
  }, [state.experience, dispatch]);

  const removeExperience = useCallback((id: string) => {
    dispatch({ type: 'REMOVE_EXPERIENCE', payload: id });
  }, [dispatch]);

  const MemoizedExperienceItem = memo(({ experience, updateExperience, removeExperience }: { experience: Experience, updateExperience: (id: string, field: keyof Experience, value: string | boolean) => void, removeExperience: (id: string) => void }) => (
    <div className="border border-gray-200 rounded-lg p-4">
      <div className="flex justify-between items-start mb-4">
        <h4 className="text-md font-medium text-gray-900">خبرة مهنية</h4>
        <button
          onClick={() => removeExperience(experience.id)}
          className="text-red-600 hover:text-red-800 transition-colors"
        >
          <TrashIcon className="h-5 w-5" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            المسمى الوظيفي *
          </label>
          <input
            type="text"
            value={experience.position}
            onChange={(e) => updateExperience(experience.id, 'position', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800"
            placeholder="مطور ويب، مصمم جرافيك"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            الشركة *
          </label>
          <input
            type="text"
            value={experience.company}
            onChange={(e) => updateExperience(experience.id, 'company', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800"
            placeholder="شركة زين العراق"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            الموقع
          </label>
          <input
            type="text"
            value={experience.location}
            onChange={(e) => updateExperience(experience.id, 'location', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800"
            placeholder="بغداد، العراق"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            وصف المهام والإنجازات *
          </label>
          <textarea
            value={experience.description}
            onChange={(e) => updateExperience(experience.id, 'description', e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800"
            placeholder="اكتب وصف للمهام والإنجازات في هذا المنصب..."
          />
        </div>
      </div>
    </div>
  ));

  const experienceList = useMemo(() => state.experience.map((experience) => (
    <MemoizedExperienceItem key={experience.id} experience={experience} updateExperience={updateExperience} removeExperience={removeExperience} />
  )), [state.experience, updateExperience, removeExperience]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">الخبرات المهنية</h3>
        <button
          onClick={addExperience}
          className="flex items-center space-x-2 space-x-reverse bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          <PlusIcon className="h-5 w-5" />
          <span>إضافة خبرة</span>
        </button>
      </div>

      {state.experience.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>لم يتم إضافة أي خبرات مهنية بعد</p>
          <button
            onClick={addExperience}
            className="mt-2 text-blue-600 hover:text-blue-500 font-medium"
          >
            إضافة أول خبرة مهنية
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {experienceList}
        </div>
      )}
    </div>
  );
});