// Static categories list for the UI (matches backend data)
export const CATEGORIES = [
  { name: 'Books & Magazines', slug: 'books-magazines' },
  { name: "Children's Books – Early Learning", slug: 'childrens-books-early-learning' },
  { name: 'Clothing – Traditional Wear', slug: 'clothing-traditional-wear' },
  { name: 'Fruits & Vegetables', slug: 'fruits-vegetables' },
  { name: 'Groceries', slug: 'groceries' },
  { name: 'Herbs & Spices', slug: 'herbs-spices' },
  { name: 'Kitchen & Dining Utilities', slug: 'kitchen-dining-utilities' },
  { name: 'Kolkata Special Seasonal Items', slug: 'kolkata-special-seasonal-items' },
  { name: 'Lentils / Dal & Rice', slug: 'lentils-dal-rice' },
  { name: 'Oil & Ghee', slug: 'oil-ghee' },
  { name: 'Puja Samogri', slug: 'puja-samogri' },
  { name: 'Skin Care', slug: 'skin-care' },
  { name: 'Snacks & Homemade Pickles', slug: 'snacks-homemade-pickles' },
  { name: 'Tea & Infusions', slug: 'tea-infusions' },
  { name: 'Uncategorized', slug: 'uncategorized' },
] as const;

export type CategorySlug = typeof CATEGORIES[number]['slug'];
