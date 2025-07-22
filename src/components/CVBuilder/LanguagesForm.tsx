import React, { useCallback, useMemo, memo } from 'react';
import { useLanguages } from '../../contexts/LanguagesContext';
import { Language } from '../../types';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';

export const LanguagesForm: React.FC = memo(() => {
  const { state, dispatch, addLanguage } = useLanguages();

  const updateLanguage = useCallback((id: string, field: keyof Language, value: string) => {
    const language = state.languages.find(lang => lang.id === id);
    if (language) {
      const updatedLanguage = { ...language, [field]: value };
      dispatch({ type: 'UPDATE_LANGUAGE', payload: { id, data: updatedLanguage } });
    }
  }, [state.languages, dispatch]);

  const removeLanguage = useCallback((id: string) => {
    dispatch({ type: 'REMOVE_LANGUAGE', payload: id });
  }, [dispatch]);

  const MemoizedLanguageItem = memo(({ language, updateLanguage, removeLanguage }: { language: Language, updateLanguage: (id: string, field: keyof Language, value: string) => void, removeLanguage: (id: string) => void }) => (
    <div className="border border-gray-200 rounded-lg p-4">
      <div className="flex justify-between items-start mb-4">
        <h4 className="text-md font-medium text-gray-900">لغة</h4>
        <button
          onClick={() => removeLanguage(language.id)}
          className="text-red-600 hover:text-red-800 transition-colors"
        >
          <TrashIcon className="h-5 w-5" />
        </button>
      </div>

      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            اسم اللغة *
          </label>
          <input
            type="text"
            value={language.name}
            onChange={(e) => updateLanguage(language.id, 'name', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800"
            placeholder="العربية، الإنجليزية، الفرنسية"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            مستوى الإتقان
          </label>
          <select
            value={language.level}
            onChange={(e) => updateLanguage(language.id, 'level', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800"
          >
            <option value="basic">أساسي</option>
            <option value="conversational">محادثة</option>
            <option value="fluent">طلاقة</option>
            <option value="native">لغة أم</option>
          </select>
        </div>
      </div>
    </div>
  ));

  const languageList = useMemo(() => state.languages.map((language) => (
    <MemoizedLanguageItem key={language.id} language={language} updateLanguage={updateLanguage} removeLanguage={removeLanguage} />
  )), [state.languages, updateLanguage, removeLanguage]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">اللغات</h3>
        <button
          onClick={addLanguage}
          className="flex items-center space-x-2 space-x-reverse bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          <PlusIcon className="h-5 w-5" />
          <span>إضافة لغة</span>
        </button>
      </div>

      {state.languages.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>لم يتم إضافة أي لغات بعد</p>
          <button
            onClick={addLanguage}
            className="mt-2 text-blue-600 hover:text-blue-500 font-medium"
          >
            إضافة أول لغة
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {languageList}
        </div>
      )}
    </div>
  );
});