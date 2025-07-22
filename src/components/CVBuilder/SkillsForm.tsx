import React, { useCallback, useMemo, memo } from 'react';
import { useSkills } from '../../contexts/SkillsContext';
import { Skill } from '../../types';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';

export const SkillsForm: React.FC = memo(() => {
  const { state, dispatch, addSkill } = useSkills();

  const updateSkill = useCallback((id: string, field: keyof Skill, value: string) => {
    const skill = state.skills.find(s => s.id === id);
    if (skill) {
      const updatedSkill = { ...skill, [field]: value };
      dispatch({ type: 'UPDATE_SKILL', payload: { id, data: updatedSkill } });
    }
  }, [state.skills, dispatch]);

  const removeSkill = useCallback((id: string) => {
    dispatch({ type: 'REMOVE_SKILL', payload: id });
  }, [dispatch]);

  const MemoizedSkillItem = memo(({ skill }: { skill: Skill }) => (
    <div className="border border-gray-200 rounded-lg p-4">
      <div className="flex justify-between items-start mb-4">
        <h4 className="text-md font-medium text-gray-900">مهارة</h4>
        <button
          onClick={() => removeSkill(skill.id)}
          className="text-red-600 hover:text-red-800 transition-colors"
        >
          <TrashIcon className="h-5 w-5" />
        </button>
      </div>

      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            اسم المهارة *
          </label>
          <input
            type="text"
            value={skill.name}
            onChange={(e) => updateSkill(skill.id, 'name', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="JavaScript, التصميم الجرافيكي"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            مستوى المهارة
          </label>
          <select
            value={skill.level}
            onChange={(e) => updateSkill(skill.id, 'level', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="beginner">مبتدئ</option>
            <option value="intermediate">متوسط</option>
            <option value="advanced">متقدم</option>
            <option value="expert">خبير</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            فئة المهارة
          </label>
          <select
            value={skill.category}
            onChange={(e) => updateSkill(skill.id, 'category', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="technical">تقنية</option>
            <option value="soft">مهارات شخصية</option>
            <option value="language">لغات</option>
            <option value="other">أخرى</option>
          </select>
        </div>
      </div>
    </div>
  ));

  const skillList = useMemo(() => state.skills.map((skill) => (
    <MemoizedSkillItem key={skill.id} skill={skill} />
  )), [state.skills, MemoizedSkillItem]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">المهارات</h3>
        <button
          onClick={addSkill}
          className="flex items-center space-x-2 space-x-reverse bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          <PlusIcon className="h-5 w-5" />
          <span>إضافة مهارة</span>
        </button>
      </div>

      {state.skills.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>لم يتم إضافة أي مهارات بعد</p>
          <button
            onClick={addSkill}
            className="mt-2 text-blue-600 hover:text-blue-500 font-medium"
          >
            إضافة أول مهارة
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {skillList}
        </div>
      )}
    </div>
  );
});