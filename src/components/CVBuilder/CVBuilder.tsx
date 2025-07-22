"use client";

import React, { useState, useMemo, useCallback, Suspense, lazy } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { templates } from '../../data/templates';
import { checkUserPaymentStatus } from '../../lib/zaincash';
import { toast } from 'react-hot-toast';
import { DocumentArrowDownIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { SparklesIcon } from '@heroicons/react/24/outline';
import { usePersonalInfo } from '../../contexts/PersonalInfoContext';
import { useEducation } from '../../contexts/EducationContext';
import { useExperience } from '../../contexts/ExperienceContext';
import { useSkills } from '../../contexts/SkillsContext';
import { useLanguages } from '../../contexts/LanguagesContext';
import { CVData } from '../../types';

// Lazy load all components for better performance
const TemplateSelector = lazy(() => import('./TemplateSelector').then(m => ({ default: m.TemplateSelector })));
const CVPreview = lazy(() => import('./CVPreview').then(m => ({ default: m.CVPreview })));
const ZainCashPayment = lazy(() => import('../Payment/ZainCashPayment').then(m => ({ default: m.ZainCashPayment })));
const PersonalInfoForm = lazy(() => import('./PersonalInfoForm').then(m => ({ default: m.PersonalInfoForm })));
const EducationForm = lazy(() => import('./EducationForm').then(m => ({ default: m.EducationForm })));
const ExperienceForm = lazy(() => import('./ExperienceForm').then(m => ({ default: m.ExperienceForm })));
const SkillsForm = lazy(() => import('./SkillsForm').then(m => ({ default: m.SkillsForm })));
const LanguagesForm = lazy(() => import('./LanguagesForm').then(m => ({ default: m.LanguagesForm })));
const StepIndicator = lazy(() => import('./StepIndicator').then(m => ({ default: m.StepIndicator })));

const steps = [
  { id: 1, name: 'معلوماتك ', completed: false },
  { id: 2, name: 'التعليم', completed: false },
  { id: 3, name: 'الخبرات ', completed: false },
  { id: 4, name: 'المهارات', completed: false },
  { id: 5, name: 'اللغات', completed: false },
  { id: 6, name: ' القالب', completed: false },
];

const FormLoading = () => (
  <div className="flex items-center justify-center py-8">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    <span className="mr-3 text-gray-600">جاري تحميل النموذج...</span>
  </div>
);

export const CVBuilder: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [isExporting, setIsExporting] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [userPlan, setUserPlan] = useState<'free' | 'premium'>('free');
  const [templateId, setTemplateId] = useState('modern-arabic');
  const { user } = useAuth();

  // Gather all context state
  const { state: personalInfoState } = usePersonalInfo();
  const { state: educationState } = useEducation();
  const { state: experienceState } = useExperience();
  const { state: skillsState } = useSkills();
  const { state: languagesState } = useLanguages();

  // Compose the CVData object
  const cv: CVData = useMemo(() => ({
    user_id: user?.id || '',
    title: 'السيرة الذاتية الجديدة',
    template_id: templateId,
    personal_info: personalInfoState.personal_info,
    education: educationState.education,
    experience: experienceState.experience,
    skills: skillsState.skills,
    languages: languagesState.languages,
    summary: personalInfoState.summary,
  }), [user?.id, templateId, personalInfoState, educationState, experienceState, skillsState, languagesState]);

  // Check user payment status on component mount
  React.useEffect(() => {
    const checkPaymentStatus = async () => {
      if (user) {
        const hasPaid = await checkUserPaymentStatus(user.id);
        setUserPlan(hasPaid ? 'premium' : 'free');
      }
    };
    checkPaymentStatus();
  }, [user]);

  const handleUpgrade = useCallback(() => {
    setShowPayment(true);
  }, []);

  const handlePaymentSuccess = useCallback(() => {
    setUserPlan('premium');
    setShowPayment(false);
    toast.success('تم تفعيل النسخة المميزة بنجاح!');
  }, []);

  const handlePaymentError = useCallback((error: string) => {
    toast.error(error);
  }, []);

  const handleExportToPDF = useCallback(async () => {
    setIsExporting(true);
    try {
      const currentTemplate = templates.find(t => t.id === cv.template_id);
      const filename = `${cv.personal_info?.full_name || user?.user_metadata?.full_name || 'السيرة الذاتية'}.pdf`;
      const pdfExportModule = await import('../../lib/pdfExport');
      const isUsingPremiumTemplate = currentTemplate?.premium && userPlan === 'free';
      if (isUsingPremiumTemplate) {
        toast.error('يجب الاشتراك لاستخدام القوالب المميزة للتصدير');
        setIsExporting(false);
        return;
      }
      await pdfExportModule.exportToPDF('cv-preview', filename, userPlan === 'free');
      toast.success('تم تصدير السيرة الذاتية بنجاح');
    } catch (error) {
      toast.error('حدث خطأ أثناء تصدير السيرة الذاتية');
      console.error('Export error:', error);
    } finally {
      setIsExporting(false);
    }
  }, [cv, user, userPlan]);

  const nextStep = useCallback(() => {
    if (currentStep < steps.length) {
      setCompletedSteps(prev => [...prev, currentStep]);
      setCurrentStep(currentStep + 1);
    }
  }, [currentStep]);

  const prevStep = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  }, [currentStep]);

  const renderCurrentStep = useCallback(() => {
    switch (currentStep) {
      case 1:
        return (
          <Suspense fallback={<div className="min-h-[300px] bg-white border border-gray-200 rounded-lg shadow-sm p-8 text-center text-gray-500">جاري تحميل النموذج...</div>}>
            <PersonalInfoForm />
          </Suspense>
        );
      case 2:
        return (
          <Suspense fallback={<div className="min-h-[300px] bg-white border border-gray-200 rounded-lg shadow-sm p-8 text-center text-gray-500">جاري تحميل النموذج...</div>}>
            <EducationForm />
          </Suspense>
        );
      case 3:
        return (
          <Suspense fallback={<div className="min-h-[300px] bg-white border border-gray-200 rounded-lg shadow-sm p-8 text-center text-gray-500">جاري تحميل النموذج...</div>}>
            <ExperienceForm />
          </Suspense>
        );
      case 4:
        return (
          <Suspense fallback={<div className="min-h-[300px] bg-white border border-gray-200 rounded-lg shadow-sm p-8 text-center text-gray-500">جاري تحميل النموذج...</div>}>
            <SkillsForm />
          </Suspense>
        );
      case 5:
        return (
          <Suspense fallback={<div className="min-h-[300px] bg-white border border-gray-200 rounded-lg shadow-sm p-8 text-center text-gray-500">جاري تحميل النموذج...</div>}>
            <LanguagesForm />
          </Suspense>
        );
      case 6:
        return (
          <Suspense fallback={<div className="min-h-[300px] bg-white border border-gray-200 rounded-lg shadow-sm p-8 text-center text-gray-500">جاري تحميل النموذج...</div>}>
            <TemplateSelector
              userPlan={userPlan}
              onUpgrade={handleUpgrade}
              templateId={templateId}
              setTemplateId={setTemplateId}
            />
          </Suspense>
        );
      default:
        return (
          <Suspense fallback={<div className="min-h-[300px] bg-white border border-gray-200 rounded-lg shadow-sm p-8 text-center text-gray-500">جاري تحميل النموذج...</div>}>
            <PersonalInfoForm />
          </Suspense>
        );
    }
  }, [currentStep, userPlan, handleUpgrade, templateId]);

  const currentTemplate = useMemo(() => templates.find(t => t.id === templateId), [templateId]);
  const isPremiumBlocked = useMemo(() => currentTemplate?.premium && userPlan === 'free', [currentTemplate, userPlan]);
  const updatedSteps = useMemo(() => steps.map(step => ({
    ...step,
    completed: completedSteps.includes(step.id)
  })), [completedSteps]);

  if (showPayment) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">ترقية إلى النسخة المميزة</h2>
            <button onClick={() => setShowPayment(false)} className="text-gray-500 hover:text-gray-700">✕</button>
          </div>
          <Suspense fallback={<FormLoading />}>
            <ZainCashPayment onSuccess={handlePaymentSuccess} onError={handlePaymentError} />
          </Suspense>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Step Indicator */}
        <Suspense fallback={<div className="h-16 bg-white border-b"></div>}>
          <StepIndicator steps={updatedSteps} currentStep={currentStep} />
        </Suspense>

        <div className="flex flex-col lg:flex-row gap-6 p-4 lg:p-6">
          {/* Form Section */}
          <div className="flex-1 lg:max-w-2xl">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6">
                {/* Only render the current step */}
                {(() => {
                  switch (currentStep) {
                    case 1:
                      return (
                        <Suspense fallback={<div className="min-h-[300px] bg-white border border-gray-200 rounded-lg shadow-sm p-8 text-center text-gray-500">جاري تحميل النموذج...</div>}>
                          <PersonalInfoForm />
                        </Suspense>
                      );
                    case 2:
                      return (
                        <Suspense fallback={<div className="min-h-[300px] bg-white border border-gray-200 rounded-lg shadow-sm p-8 text-center text-gray-500">جاري تحميل النموذج...</div>}>
                          <EducationForm />
                        </Suspense>
                      );
                    case 3:
                      return (
                        <Suspense fallback={<div className="min-h-[300px] bg-white border border-gray-200 rounded-lg shadow-sm p-8 text-center text-gray-500">جاري تحميل النموذج...</div>}>
                          <ExperienceForm />
                        </Suspense>
                      );
                    case 4:
                      return (
                        <Suspense fallback={<div className="min-h-[300px] bg-white border border-gray-200 rounded-lg shadow-sm p-8 text-center text-gray-500">جاري تحميل النموذج...</div>}>
                          <SkillsForm />
                        </Suspense>
                      );
                    case 5:
                      return (
                        <Suspense fallback={<div className="min-h-[300px] bg-white border border-gray-200 rounded-lg shadow-sm p-8 text-center text-gray-500">جاري تحميل النموذج...</div>}>
                          <LanguagesForm />
                        </Suspense>
                      );
                    case 6:
                      return (
                        <Suspense fallback={<div className="min-h-[300px] bg-white border border-gray-200 rounded-lg shadow-sm p-8 text-center text-gray-500">جاري تحميل النموذج...</div>}>
                          <TemplateSelector
                            userPlan={userPlan}
                            onUpgrade={handleUpgrade}
                            templateId={templateId}
                            setTemplateId={setTemplateId}
                          />
                        </Suspense>
                      );
                    default:
                      return (
                        <Suspense fallback={<div className="min-h-[300px] bg-white border border-gray-200 rounded-lg shadow-sm p-8 text-center text-gray-500">جاري تحميل النموذج...</div>}>
                          <PersonalInfoForm />
                        </Suspense>
                      );
                  }
                })()}
              </div>

              {/* Navigation */}
              <div className="border-t border-gray-200 px-6 py-4">
                <div className="flex items-center justify-between">
                  <button
                    onClick={prevStep}
                    disabled={currentStep === 1}
                    className="flex items-center space-x-2 space-x-reverse px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRightIcon className="h-4 w-4" />
                    <span>السابق</span>
                  </button>

                  <div className="flex items-center space-x-2 space-x-reverse">
                    <span className="text-sm text-gray-500">
                      {currentStep} من {steps.length}
                    </span>
                  </div>

                  {currentStep < steps.length ? (
                    <button
                      onClick={nextStep}
                      className="flex items-center space-x-2 space-x-reverse px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 transition-colors"
                    >
                      <span>التالي</span>
                      <ChevronLeftIcon className="h-4 w-4" />
                    </button>
                  ) : (
                    <button
                      onClick={handleExportToPDF}
                      disabled={isExporting || isPremiumBlocked}
                      className={`flex items-center space-x-2 space-x-reverse px-6 py-2 text-sm font-medium rounded-md transition-colors ${
                        isPremiumBlocked 
                          ? 'bg-gray-400 text-white cursor-not-allowed' 
                          : 'bg-green-600 text-white hover:bg-green-700'
                      }`}
                    >
                      <DocumentArrowDownIcon className="h-4 w-4" />
                      <span>
                        {isExporting ? 'جاري التصدير...' : 'تصدير PDF'}
                      </span>
                    </button>
                  )}
                </div>

                {isPremiumBlocked && (
                  <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                    <p className="text-sm text-yellow-800">
                      💡 هذا القالب مميز. يمكنك المعاينة المجانية، لكن للتصدير يجب الاشتراك في النسخة المميزة.
                    </p>
                    <button
                      onClick={handleUpgrade}
                      className="mt-2 text-sm text-blue-600 hover:text-blue-800 underline"
                    >
                      الاشتراك الآن
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Preview Section */}
          <div className="flex-1 lg:max-w-2xl">
            {isPremiumBlocked && (
              <div className="mb-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <SparklesIcon className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-blue-900 mb-1">معاينة القالب المميز</h4>
                    <p className="text-sm text-blue-700">
                      تستطيع مشاهدة كيف ستبدو سيرتك الذاتية بهذا القالب المميز. للحصول على نسخة PDF، يرجى الاشتراك.
                    </p>
                  </div>
                </div>
              </div>
            )}
            <Suspense fallback={<div className="min-h-[300px] bg-white border border-gray-200 rounded-lg shadow-sm p-8 text-center text-gray-500">جاري تحميل المعاينة...</div>}>
              <CVPreview template_id={templateId} title={cv.title} user_id={cv.user_id} />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
};