import { Template } from '../types';

export const templates: Template[] = [
  {
    id: 'modern-arabic',
    name: 'العصري العربي',
    category: 'modern',
    premium: false,
    preview_url: '/templates/modern-arabic-preview.jpg',
    description: 'قالب عصري وأنيق مع تدرج لوني جذاب، مثالي للمهن التقنية والإبداعية'
  },
  {
    id: 'classic-professional',
    name: 'الكلاسيكي المهني',
    category: 'classic',
    premium: true,
    preview_url: '/templates/classic-preview.jpg',
    description: 'قالب كلاسيكي أنيق مناسب للمهن الإدارية والمالية والقانونية'
  },
  {
    id: 'minimalist-clean',
    name: 'البسيط النظيف',
    category: 'minimalist',
    premium: true,
    preview_url: '/templates/minimalist-preview.jpg',
    description: 'تصميم بسيط ونظيف يركز على المحتوى، مثالي للأكاديميين والباحثين'
  },
  {
    id: 'creative-colorful',
    name: 'الإبداعي الملون',
    category: 'creative',
    premium: true,
    preview_url: '/templates/creative-preview.jpg',
    description: 'قالب إبداعي بألوان زاهية مناسب للمصممين والفنانين'
  },
  {
    id: 'executive-premium',
    name: 'التنفيذي المميز',
    category: 'professional',
    premium: true,
    preview_url: '/templates/executive-preview.jpg',
    description: 'قالب راقي ومميز للمناصب التنفيذية والإدارية العليا'
  }
];

export const getFreeTemplates = () => templates.filter(t => !t.premium);
export const getPremiumTemplates = () => templates.filter(t => t.premium);
export const getTemplateById = (id: string) => templates.find(t => t.id === id);