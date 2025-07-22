export const formatDate = (dateString: string): string => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('ar-SA', { 
    year: 'numeric', 
    month: 'long' 
  });
};

export const getLanguageLevelText = (level: string): string => {
  switch (level) {
    case 'basic': return 'أساسي';
    case 'conversational': return 'محادثة';
    case 'fluent': return 'طلاقة';
    case 'native': return 'لغة أم';
    default: return 'متوسط';
  }
};

export const getSkillLevelWidth = (level: string): string => {
  switch (level) {
    case 'beginner': return 'w-1/4';
    case 'intermediate': return 'w-1/2';
    case 'advanced': return 'w-3/4';
    case 'expert': return 'w-full';
    default: return 'w-1/2';
  }
};