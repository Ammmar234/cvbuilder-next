import React, { useCallback, useMemo, memo } from 'react';
import { useEducation } from '../../contexts/EducationContext';
import { Education } from '../../types';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';

const MemoizedEducationItem = memo(({ education }: { education: Education }) => (
  <div className="border border-gray-200 rounded-lg p-4">
    <div className="flex justify-between items-start mb-4">
      <h4 className="text-md font-medium text-gray-900">مؤهل تعليمي</h4>
      <button
        onClick={() => removeEducation(education.id)}
        className="text-red-600 hover:text-red-800 transition-colors"
      >
        <TrashIcon className="h-5 w-5" />
      </button>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          الدرجة العلمية *
        </label>
        <input
          type="text"
          value={education.degree}
          onChange={(e) => updateEducation(education.id, 'degree', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="بكالوريوس، ماجستير، دكتوراه"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          الجامعة/المؤسسة *
        </label>
        <input
          type="text"
          value={education.institution}
          onChange={(e) => updateEducation(education.id, 'institution', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="جامعة بغداد"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          الموقع
        </label>
        <input
          type="text"
          value={education.location}
          onChange={(e) => updateEducation(education.id, 'location', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="بغداد، العراق"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          المعدل التراكمي (اختياري)
        </label>
        <input
          type="text"
          value={education.gpa}
          onChange={(e) => updateEducation(education.id, 'gpa', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="85.0"
        />
      </div>

      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          وصف إضافي (اختياري)
        </label>
        <textarea
          value={education.description}
          onChange={(e) => updateEducation(education.id, 'description', e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="أي معلومات إضافية عن دراستك..."
        />
      </div>
    </div>
  </div>
));
MemoizedEducationItem.displayName = 'MemoizedEducationItem';

const EducationFormComponent: React.FC = () => {
  const { state, dispatch, addEducation } = useEducation();

  const updateEducation = useCallback((id: string, field: keyof Education, value: string) => {
    const education = state.education.find(edu => edu.id === id);
    if (education) {
      const updatedEducation = { ...education, [field]: value };
      dispatch({ type: 'UPDATE_EDUCATION', payload: { id, data: updatedEducation } });
    }
  }, [state.education, dispatch]);

  const removeEducation = useCallback((id: string) => {
    dispatch({ type: 'REMOVE_EDUCATION', payload: id });
  }, [dispatch]);

  const educationList = useMemo(() => state.education.map((education) => (
    <MemoizedEducationItem key={education.id} education={education} />
  )), [state.education, MemoizedEducationItem]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">التعليم</h3>
        <button
          onClick={addEducation}
          className="flex items-center space-x-2 space-x-reverse bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          <PlusIcon className="h-5 w-5" />
          <span>إضافة تعليم</span>
        </button>
      </div>

      {state.education.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>لم يتم إضافة أي معلومات تعليمية بعد</p>
          <button
            onClick={addEducation}
            className="mt-2 text-blue-600 hover:text-blue-500 font-medium"
          >
            إضافة أول مؤهل تعليمي
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {educationList}
        </div>
      )}
    </div>
  );
};
EducationFormComponent.displayName = 'EducationForm';
export const EducationForm = memo(EducationFormComponent);