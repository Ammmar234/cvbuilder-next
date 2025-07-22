"use client";

import React, { useMemo } from 'react';
import { templates } from '../../data/templates';
import { CheckIcon, StarIcon, LockClosedIcon, CheckCircleIcon, HomeIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { SparklesIcon } from '@heroicons/react/24/solid';

interface TemplateSelectorProps {
  userPlan: 'free' | 'premium';
  onUpgrade: () => void;
  templateId: string;
  setTemplateId: (id: string) => void;
}

export const TemplateSelector: React.FC<TemplateSelectorProps> = ({ 
  userPlan, 
  onUpgrade,
  templateId,
  setTemplateId
}) => {
  const handleTemplateSelect = (id: string) => {
    const template = templates.find(t => t.id === id);
    setTemplateId(id);
    if (template?.premium && userPlan === 'free') {
      setTimeout(() => {
        const upgradeMessage = document.createElement('div');
        upgradeMessage.className = 'fixed top-4 right-4 bg-blue-100 border border-blue-300 text-blue-800 px-4 py-2 rounded-lg shadow-lg z-50';
        upgradeMessage.innerHTML = '💡 يمكنك معاينة هذا القالب المميز مجاناً، لكن للتصدير يجب الاشتراك';
        document.body.appendChild(upgradeMessage);
        setTimeout(() => {
          document.body.removeChild(upgradeMessage);
        }, 4000);
      }, 100);
    }
  };

  const freeTemplates = useMemo(() => templates.filter(t => !t.premium), []);
  const premiumTemplates = useMemo(() => templates.filter(t => t.premium), []);

  const TemplateCard: React.FC<{ template: typeof templates[0] }> = React.memo(({ template }) => {
    const isSelected = templateId === template.id;
    const isPremium = template.premium;
    const canUse = !isPremium || userPlan === 'premium';

    return (
      <div
        className={`relative border rounded-xl p-4 cursor-pointer transition-all duration-300 hover:shadow-md ${
          isSelected 
            ? 'border-blue-500 ring-2 ring-blue-300 bg-blue-50' 
            : 'border-gray-200 hover:border-gray-300'
        } ${!canUse ? 'opacity-75' : ''}`}
        onClick={() => handleTemplateSelect(template.id)}
      >
        {/* Premium Badge */}
        {isPremium && (
          <div className="absolute top-2 left-2 z-10">
            <div className="flex items-center space-x-1 space-x-reverse bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-2 py-1 rounded-full text-xs font-medium">
              <SparklesIcon className="w-3 h-3" />
              <span>مميز</span>
            </div>
          </div>
        )}

        {/* Lock overlay for premium templates when user is on free plan */}
        {isPremium && userPlan === 'free' && (
          <div className="absolute inset-0 bg-black bg-opacity-20 rounded-xl flex items-center justify-center z-10">
            <div className="bg-white rounded-full p-2 shadow-lg">
              <LockClosedIcon className="w-6 h-6 text-gray-600" />
            </div>
          </div>
        )}

        {/* Selection indicator */}
        {isSelected && (
          <div className="absolute top-2 right-2 z-10">
            <div className="bg-blue-600 text-white rounded-full p-1">
              <CheckIcon className="w-4 h-4" />
            </div>
          </div>
        )}

        {/* Template Preview */}
        <div className="mb-3">
          <div className="w-full h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
            <div className="text-center text-gray-500">
              <div className="w-8 h-8 mx-auto mb-2 bg-gray-300 rounded"></div>
              <div className="text-xs">معاينة القالب</div>
            </div>
          </div>
        </div>

        {/* Template Info */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">{template.name}</h3>
            {isPremium && (
              <StarIcon className="w-4 h-4 text-yellow-500" />
            )}
          </div>
          <p className="text-sm text-gray-600 leading-relaxed">{template.description}</p>
          <div className="flex items-center justify-between">
            <span className="inline-block bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
              {template.category}
            </span>
            {isPremium && userPlan === 'free' && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onUpgrade();
                }}
                className="text-xs text-blue-600 hover:text-blue-800 font-medium"
              >
                ترقية للوصول
              </button>
            )}
          </div>
        </div>
      </div>
    );
  });
  TemplateCard.displayName = 'TemplateCard';

const TemplateSelectorComponent: React.FC<TemplateSelectorProps> = ({ 
  userPlan, 
  onUpgrade,
  templateId,
  setTemplateId
}) => {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">اختر قالب سيرتك الذاتية</h3>
        <p className="text-gray-600">
          اختر من مجموعة متنوعة من القوالب المصممة خصيصاً للسوق العربي
        </p>
      </div>

      {/* Free Templates */}
      <div>
        <div className="flex items-center space-x-2 space-x-reverse mb-4">
          <h4 className="text-lg font-semibold text-gray-900">القوالب المجانية</h4>
          <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">
            مجاني
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {freeTemplates.map((template) => (
            <TemplateCard key={template.id} template={template} />
          ))}
        </div>
      </div>

      {/* Premium Templates */}
      {premiumTemplates.length > 0 && (
        <div>
          <div className="flex items-center space-x-2 space-x-reverse mb-4">
            <h4 className="text-lg font-semibold text-gray-900">القوالب المميزة</h4>
            <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-2 py-1 rounded text-xs font-medium">
              مميز
            </span>
          </div>
          {userPlan === 'free' && (
            <div className="mb-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg">
              <div className="flex items-center space-x-3 space-x-reverse">
                <SparklesIcon className="w-8 h-8 text-blue-600" />
                <div>
                  <h5 className="font-semibold text-blue-900">احصل على القوالب المميزة</h5>
                  <p className="text-sm text-blue-700">
                    ترقية إلى النسخة المميزة للوصول إلى جميع القوالب والميزات الإضافية
                  </p>
                </div>
                <button
                  onClick={onUpgrade}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  ترقية الآن
                </button>
              </div>
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {premiumTemplates.map((template) => (
              <TemplateCard key={template.id} template={template} />
            ))}
          </div>
        </div>
      )}

      {/* Current Selection Info */}
      {templateId && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-2 space-x-reverse">
            <CheckIcon className="w-5 h-5 text-green-600" />
            <span className="text-gray-900 font-medium">
              القالب المحدد: {templates.find(t => t.id === templateId)?.name}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
TemplateSelectorComponent.displayName = 'TemplateSelector';}
// export const TemplateSelector = TemplateSelectorComponent;