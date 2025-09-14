// Shared categories and departments constants
export const CATEGORIES = [
  { value: 'infrastructure', label: 'Infrastructure', icon: '🏗️' },
  { value: 'healthcare', label: 'Healthcare', icon: '🏥' },
  { value: 'education', label: 'Education', icon: '🎓' },
  { value: 'transport', label: 'Transport', icon: '🚌' },
  { value: 'sanitation', label: 'Sanitation', icon: '🧹' },
  { value: 'safety', label: 'Safety', icon: '🚨' },
  { value: 'other', label: 'Other', icon: '📋' }
];

export const PRIORITIES = [
  { value: 'low', label: 'Low', color: 'bg-green-100 text-green-800' },
  { value: 'medium', label: 'Medium', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'high', label: 'High', color: 'bg-orange-100 text-orange-800' },
  { value: 'critical', label: 'Critical', color: 'bg-red-100 text-red-800' }
];

// Default departments (can be overridden by admin-created departments)
export const DEFAULT_DEPARTMENTS = [
  { value: 'public-works', label: 'Public Works' },
  { value: 'traffic', label: 'Traffic Police' },
  { value: 'sanitation', label: 'Sanitation' },
  { value: 'health', label: 'Health Department' },
  { value: 'education', label: 'Education' },
  { value: 'transport', label: 'Transport' }
];
