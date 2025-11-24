import { Tip } from '../../types/api';

const MOCK_TIPS: Tip[] = [
  {
    id: '1',
    title: 'Stay Hydrated Throughout the Day',
    category: 'Hydration',
    content: 'Drink at least 8 glasses (2 liters) of water daily. Carry a water bottle with you and set reminders to drink water every hour. Proper hydration improves metabolism, energy levels, and cognitive function.',
    description: 'Learn why hydration is crucial for your health',
    source: 'WHO Guidelines',
    readTime: 3,
    difficulty: 'beginner'
  },
  {
    id: '2',
    title: 'Balanced Plate Method',
    category: 'Nutrition',
    content: 'Divide your plate into quarters: 1/2 vegetables, 1/4 lean protein, 1/4 whole grains. This ensures you get a balanced mix of nutrients, fiber, and protein in every meal.',
    description: 'Simple visual guide for balanced meals',
    source: 'Harvard Healthy Eating Plate',
    readTime: 2,
    difficulty: 'beginner'
  },
  {
    id: '3',
    title: 'Mindful Eating Practices',
    category: 'Mindfulness',
    content: 'Eat without distractions, chew slowly, and listen to your hunger cues. It takes 20 minutes for your brain to register fullness, so eating slowly can prevent overeating.',
    description: 'Transform your relationship with food',
    readTime: 4,
    difficulty: 'intermediate'
  },
  {
    id: '4',
    title: 'Protein Timing for Muscle Recovery',
    category: 'Fitness',
    content: 'Consume 20-30g of protein within 30 minutes after exercise. This window maximizes muscle protein synthesis and accelerates recovery.',
    description: 'Optimize your post-workout nutrition',
    source: 'International Society of Sports Nutrition',
    readTime: 3,
    difficulty: 'intermediate'
  },
  {
    id: '5',
    title: 'Sleep Quality Over Quantity',
    category: 'Sleep',
    content: 'Maintain consistent sleep schedule, keep bedroom dark and cool, avoid screens 1 hour before bed. Quality sleep is crucial for hormone regulation and recovery.',
    description: 'Improve your sleep for better health',
    readTime: 5,
    difficulty: 'beginner'
  },
  {
    id: '6',
    title: 'Intermittent Fasting Basics',
    category: 'Nutrition',
    content: 'Start with 12-hour fasting window (7 PM to 7 AM). Gradually increase to 16 hours if comfortable. Focus on nutrient-dense foods during eating window.',
    description: 'Introduction to time-restricted eating',
    source: 'New England Journal of Medicine',
    readTime: 6,
    difficulty: 'advanced'
  },
  {
    id: '7',
    title: 'Stress Management Through Nutrition',
    category: 'Mental Health',
    content: 'Foods rich in magnesium (spinach, almonds), omega-3s (salmon, walnuts), and vitamin C (citrus fruits) can help regulate cortisol levels and reduce stress.',
    description: 'Eat your way to calmness',
    readTime: 4,
    difficulty: 'intermediate'
  },
  {
    id: '8',
    title: 'Gut Health Fundamentals',
    category: 'Digestive Health',
    content: 'Include fermented foods (yogurt, kimchi), prebiotic fibers (garlic, onions, bananas), and diverse plant foods. A healthy gut microbiome supports immunity and mental health.',
    description: 'Nourish your gut for overall wellness',
    readTime: 5,
    difficulty: 'intermediate'
  }
];

const CATEGORIES = [
  'All',
  'Nutrition',
  'Hydration',
  'Fitness',
  'Sleep',
  'Mindfulness',
  'Mental Health',
  'Digestive Health'
];

export const tipsApi = {
  // Get all tips with optional filtering
  getTips: async (category?: string, searchQuery?: string): Promise<Tip[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    let filteredTips = MOCK_TIPS;
    
    // Filter by category
    if (category && category !== 'All') {
      filteredTips = filteredTips.filter(tip => tip.category === category);
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filteredTips = filteredTips.filter(tip =>
        tip.title.toLowerCase().includes(query) ||
        tip.content.toLowerCase().includes(query) ||
        tip.category.toLowerCase().includes(query)
      );
    }
    
    return filteredTips;
  },

  // Get tips by category
  getTipsByCategory: async (category: string): Promise<Tip[]> => {
    return tipsApi.getTips(category);
  },

  // Search tips
  searchTips: async (query: string): Promise<Tip[]> => {
    return tipsApi.getTips(undefined, query);
  },

  // Get all categories
  getCategories: async (): Promise<string[]> => {
    return CATEGORIES;
  },

  // Get featured tips (for home screen)
  getFeaturedTips: async (): Promise<Tip[]> => {
    return MOCK_TIPS.slice(0, 3); // First 3 tips as featured
  },

  // Bookmark a tip
  bookmarkTip: async (tipId: string, bookmarked: boolean): Promise<void> => {
    // In real app, this would update on backend
    await new Promise(resolve => setTimeout(resolve, 200));
    console.log(`Tip ${tipId} ${bookmarked ? 'bookmarked' : 'unbookmarked'}`);
  }
};