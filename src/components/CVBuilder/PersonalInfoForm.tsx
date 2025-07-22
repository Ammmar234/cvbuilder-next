import React, { useState, useCallback, memo, useMemo, useEffect } from 'react';
import { usePersonalInfo } from '../../contexts/PersonalInfoContext';
import { PersonalInfo } from '../../types';
import { CameraIcon, TrashIcon } from '@heroicons/react/24/outline';
import { debounce, optimizeImageUrl } from '../../lib/utils';

export const PersonalInfoForm: React.FC = memo(() => {
  const { state, dispatch } = usePersonalInfo();
  // Local state for all fields
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({ ...state.personal_info });
  const [summary, setSummary] = useState<string>(state.summary || '');
  const [imagePreview, setImagePreview] = useState<string | null>(state.personal_info.photo_url || null);

  // Debounced context update for personal info
  const debouncedUpdateContext = useMemo(
    () => debounce((info: PersonalInfo) => {
      dispatch({ type: 'UPDATE_PERSONAL_INFO', payload: info });
    }, 500),
    [dispatch]
  );

  // Debounced context update for summary
  const debouncedUpdateSummary = useMemo(
    () => debounce((value: string) => {
      dispatch({ type: 'SET_SUMMARY', payload: value });
    }, 500),
    [dispatch]
  );

  // Sync local state with context if cv changes (e.g., step navigation)
  useEffect(() => {
    setPersonalInfo({ ...state.personal_info });
    setSummary(state.summary || '');
    setImagePreview(state.personal_info.photo_url || null);
  }, [state.personal_info, state.summary]);

  // Local change handler
  const handleLocalChange = useCallback((field: keyof PersonalInfo, value: string) => {
    setPersonalInfo((prev) => ({ ...prev, [field]: value }));
    debouncedUpdateContext({ ...personalInfo, [field]: value });
  }, [debouncedUpdateContext, personalInfo]);

  // On blur, immediately update context
  const handleBlur = useCallback((field: keyof PersonalInfo) => {
    dispatch({ type: 'UPDATE_PERSONAL_INFO', payload: personalInfo });
  }, [dispatch, personalInfo]);

  // Summary handlers
  const handleSummaryChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setSummary(e.target.value);
    debouncedUpdateSummary(e.target.value);
  }, [debouncedUpdateSummary]);

  const handleSummaryBlur = useCallback(() => {
    dispatch({ type: 'SET_SUMMARY', payload: summary });
  }, [dispatch, summary]);

  // Optimized image upload with compression
  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('حجم الصورة يجب أن يكون أقل من 2 ميجابايت');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageUrl = event.target?.result as string;
        const optimizedUrl = optimizeImageUrl(imageUrl, 400, 400);
        setImagePreview(optimizedUrl);
        setPersonalInfo((prev) => ({ ...prev, photo_url: optimizedUrl }));
        dispatch({ type: 'UPDATE_PERSONAL_INFO', payload: { ...personalInfo, photo_url: optimizedUrl } });
      };
      reader.readAsDataURL(file);
    }
  }, [dispatch, personalInfo]);

  const removeImage = useCallback(() => {
    setImagePreview(null);
    setPersonalInfo((prev) => ({ ...prev, photo_url: '' }));
    dispatch({ type: 'UPDATE_PERSONAL_INFO', payload: { ...personalInfo, photo_url: '' } });
  }, [dispatch, personalInfo]);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">المعلومات الشخصية</h3>
        {/* Personal Photo Section */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            الصورة الشخصية (اختياري)
          </label>
          <div className="flex items-center space-x-4 space-x-reverse">
            {imagePreview ? (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="صورة شخصية"
                  loading="lazy"
                  width="96"
                  height="96"
                  className="w-24 h-24 rounded-full object-cover border-4 border-gray-200"
                  style={{ maxWidth: 96, maxHeight: 96 }}
                />
                <button
                  onClick={removeImage}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                  type="button"
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="w-24 h-24 rounded-full bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center">
                <CameraIcon className="h-8 w-8 text-gray-400" />
              </div>
            )}
            <div>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="photo-upload"
              />
              <label
                htmlFor="photo-upload"
                className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors inline-block"
              >
                {imagePreview ? 'تغيير الصورة' : 'إضافة صورة'}
              </label>
              <p className="text-xs text-gray-500 mt-1">
                يُفضل صورة مربعة بحجم 400x400 بكسل (أقل من 2 ميجابايت)
              </p>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              الاسم الكامل *
            </label>
            <input
              type="text"
              value={personalInfo.full_name}
              onChange={e => handleLocalChange('full_name', e.target.value)}
              onBlur={() => handleBlur('full_name')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="ابو حنين "
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              المسمى الوظيفي *
            </label>
            <input
              type="text"
              value={personalInfo.job_title}
              onChange={e => handleLocalChange('job_title', e.target.value)}
              onBlur={() => handleBlur('job_title')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="مثل: مطور ويب، مهندس برمجيات"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              البريد الإلكتروني *
            </label>
            <input
              type="email"
              value={personalInfo.email}
              onChange={e => handleLocalChange('email', e.target.value)}
              onBlur={() => handleBlur('email')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="example@email.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              رقم الهاتف *
            </label>
            <input
              type="tel"
              value={personalInfo.phone}
              onChange={e => handleLocalChange('phone', e.target.value)}
              onBlur={() => handleBlur('phone')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="+964 770 123 4567"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              الموقع/المدينة *
            </label>
            <input
              type="text"
              value={personalInfo.location}
              onChange={e => handleLocalChange('location', e.target.value)}
              onBlur={() => handleBlur('location')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="بغداد، العراق"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              لينكد إن (اختياري)
            </label>
            <input
              type="url"
              value={personalInfo.linkedin}
              onChange={e => handleLocalChange('linkedin', e.target.value)}
              onBlur={() => handleBlur('linkedin')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://linkedin.com/in/yourprofile"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              الموقع الشخصي (اختياري)
            </label>
            <input
              type="url"
              value={personalInfo.website}
              onChange={e => handleLocalChange('website', e.target.value)}
              onBlur={() => handleBlur('website')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://yourwebsite.com"
            />
          </div>
        </div>
      </div>
      <div>
        <h4 className="text-md font-medium text-gray-900 mb-2">النبذة الشخصية</h4>
        <textarea
          value={summary}
          onChange={handleSummaryChange}
          onBlur={handleSummaryBlur}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="اكتب نبذة مختصرة عن نفسك وخبراتك المهنية..."
        />
      </div>
    </div>
  );
});