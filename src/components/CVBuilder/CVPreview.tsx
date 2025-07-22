import React, { Suspense, lazy, useMemo, memo } from 'react';
import { templates } from '../../data/templates';
import { usePersonalInfo } from '../../contexts/PersonalInfoContext';
import { useEducation } from '../../contexts/EducationContext';
import { useExperience } from '../../contexts/ExperienceContext';
import { useSkills } from '../../contexts/SkillsContext';
import { useLanguages } from '../../contexts/LanguagesContext';
import { CVData } from '../../types';

// Optimized lazy loading with better error handling
const ModernArabicTemplate = lazy(() => 
  import('../Templates/ModernArabicTemplate').then((module) => ({
    default: module.ModernArabicTemplate,
  }))
);
const ClassicTemplate = lazy(() => 
  import('../Templates/ClassicTemplate').then((module) => ({
    default: module.ClassicTemplate,
  }))
);
const MinimalistTemplate = lazy(() => 
  import('../Templates/MinimalistTemplate').then((module) => ({
    default: module.MinimalistTemplate,
  }))
);
const CreativeTemplate = lazy(() => 
  import('../Templates/CreativeTemplate').then((module) => ({
    default: module.CreativeTemplate,
  }))
);
const ExecutiveTemplate = lazy(() => 
  import('../Templates/ExecutiveTemplate').then((module) => ({
    default: module.ExecutiveTemplate,
  }))
);

const templateComponents = {
  'modern-arabic': ModernArabicTemplate,
  'classic-professional': ClassicTemplate,
  'minimalist-clean': MinimalistTemplate,
  'creative-colorful': CreativeTemplate,
  'executive-premium': ExecutiveTemplate,
} as const;

const TemplateLoading = memo(() => (
  <div className="flex items-center justify-center py-12">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    <span className="mr-3 text-gray-500">جاري تحميل القالب...</span>
  </div>
));
TemplateLoading.displayName = 'TemplateLoading';

const CVPreviewComponent: React.FC<{ template_id?: string; title?: string; user_id?: string; }> = ({ template_id, title, user_id }) => {
  const { state: personalInfoState } = usePersonalInfo();
  const { state: educationState } = useEducation();
  const { state: experienceState } = useExperience();
  const { state: skillsState } = useSkills();
  const { state: languagesState } = useLanguages();

  // Compose the CVData object
  const cv: CVData = useMemo(() => ({
    user_id: user_id || '',
    title: title || 'السيرة الذاتية الجديدة',
    template_id: template_id || 'modern-arabic',
    personal_info: personalInfoState.personal_info,
    education: educationState.education,
    experience: experienceState.experience,
    skills: skillsState.skills,
    languages: languagesState.languages,
    summary: personalInfoState.summary,
  }), [user_id, title, template_id, personalInfoState, educationState, experienceState, skillsState, languagesState]);

  // Memoized template selection
  const TemplateComponent = useMemo(() => {
    const tid = cv.template_id || 'modern-arabic';
    return templateComponents[tid as keyof typeof templateComponents] || ModernArabicTemplate;
  }, [cv.template_id]);

  // Memoized template name
  const templateName = useMemo(() => {
    const tid = cv.template_id || 'modern-arabic';
    return templates.find(t => t.id === tid)?.name || 'العصري العربي';
  }, [cv.template_id]);

  // Memoized template rendering
  const memoizedTemplate = useMemo(() => {
    return <TemplateComponent cv={cv} />;
  }, [TemplateComponent, cv]);

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">معاينة السيرة الذاتية</h3>
          <div className="text-sm text-gray-500">
            القالب: {templateName}
          </div>
        </div>
      </div>

      <div className="p-2 lg:p-4 overflow-auto max-h-[600px] lg:max-h-[800px]">
        <div className="transform scale-90 lg:scale-75 origin-top-right" id="cv-preview">
          <Suspense fallback={<TemplateLoading />}>
            {memoizedTemplate}
          </Suspense>
        </div>
      </div>
    </div>
  );
};
CVPreviewComponent.displayName = 'CVPreview';
export const CVPreview = memo(CVPreviewComponent);