import type { IssueCategory, CategoryConfig } from '../types';

export const CATEGORIES: Record<IssueCategory, CategoryConfig> = {
  roads: {
    id: 'roads',
    label: 'Roads & Potholes',
    labelHi: 'सड़कें और गड्ढे',
    iconName: 'Construction',
    department: 'roads-infra',
    description: 'Potholes, broken asphalt, missing manhole covers, speed breaker damage.',
    descriptionHi: 'गड्ढे, टूटी सड़कें, मैनहोल कवर गायब होना, स्पीड ब्रेकर की क्षति।',
    color: '#EAB308',
    bgGradient: 'from-amber-500/20 to-orange-500/10',
  },
  sanitation: {
    id: 'sanitation',
    label: 'Garbage & Sanitation',
    labelHi: 'कचरा एवं स्वच्छता',
    iconName: 'Trash2',
    department: 'sanitation-dept',
    description: 'Overflowing dustbins, uncollected waste, illegal dumping, street sweeping.',
    descriptionHi: 'ओवरफ्लो होते डस्टबिन, बिना उठा कचरा, अवैध कचरा फेंकना।',
    color: '#10B981',
    bgGradient: 'from-emerald-500/20 to-teal-500/10',
  },
  electricity: {
    id: 'electricity',
    label: 'Streetlights & Electricity',
    labelHi: 'स्ट्रीटलाइट एवं बिजली',
    iconName: 'Zap',
    department: 'electricity-board',
    description: 'Non-functional streetlights, dangerous loose wiring, transformer leaks.',
    descriptionHi: 'खराब स्ट्रीटलाइट्स, खतरनाक खुले तार, ट्रांसफॉर्मर रिसाव।',
    color: '#6366F1',
    bgGradient: 'from-indigo-500/20 to-blue-500/10',
  },
  water: {
    id: 'water',
    label: 'Water Supply Leakage',
    labelHi: 'जल आपूर्ति रिसाव',
    iconName: 'Droplets',
    department: 'water-supply',
    description: 'Pipeline bursts, water contamination, low pressure, wasted drinkable water.',
    descriptionHi: 'पाइपलाइन फटना, दूषित पानी, कम दबाव, पेयजल की बर्बादी।',
    color: '#06B6D4',
    bgGradient: 'from-cyan-500/20 to-sky-500/10',
  },
  'public-property': {
    id: 'public-property',
    label: 'Public Property Damage',
    labelHi: 'सार्वजनिक संपत्ति की क्षति',
    iconName: 'Building2',
    department: 'public-works',
    description: 'Damaged bus shelters, broken park benches, missing signage, vandalized walls.',
    descriptionHi: 'टूटे बस शेल्टर, बेंच, संकेत बोर्ड गायब होना, सार्वजनिक दीवारों की क्षति।',
    color: '#EC4899',
    bgGradient: 'from-pink-500/20 to-rose-500/10',
  },
  drainage: {
    id: 'drainage',
    label: 'Drainage & Waterlogging',
    labelHi: 'जल निकासी एवं जलभराव',
    iconName: 'Waves',
    department: 'drainage-sewerage',
    description: 'Blocked storm drains, sewage overflow, severe road waterlogging after rain.',
    descriptionHi: 'बंद नाले, सीवर ओवरफ्लो, बारिश के बाद सड़कों पर जलभराव।',
    color: '#8B5CF6',
    bgGradient: 'from-purple-500/20 to-violet-500/10',
  },
};

export const getCategoryById = (id: IssueCategory): CategoryConfig => {
  return CATEGORIES[id] || CATEGORIES.roads;
};

export const categoryList = Object.values(CATEGORIES);
