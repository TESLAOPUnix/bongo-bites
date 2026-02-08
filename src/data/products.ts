export type StockStatus = 'in-stock' | 'out-of-stock' | 'upcoming';

export interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number;
  category: string;
  categorySlug: string;
  image: string;
  images?: string[];
  description: string;
  ingredients?: string;
  howToUse?: string;
  shippingInfo?: string;
  stockStatus: StockStatus;
  rating?: number;
  reviewCount?: number;
  isBestseller?: boolean;
  isNew?: boolean;
  weight?: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
  description: string;
  productCount: number;
}

export const categories: Category[] = [
  {
    id: '1',
    name: 'Snacks & Homemade Pickles',
    slug: 'snacks-homemade-pickles',
    image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400&h=400&fit=crop',
    description: 'Traditional Bengali snacks and authentic homemade pickles',
    productCount: 45,
  },
  {
    id: '2',
    name: 'Sweets & Mishti',
    slug: 'sweets-mishti',
    image: 'https://images.unsplash.com/photo-1606471191009-63994c53433b?w=400&h=400&fit=crop',
    description: 'Authentic Bengali sweets made with traditional recipes',
    productCount: 32,
  },
  {
    id: '3',
    name: 'Lentils/Dal & Rice',
    slug: 'lentils-dal-rice',
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=400&fit=crop',
    description: 'Premium quality dal and rice from Bengal',
    productCount: 28,
  },
  {
    id: '4',
    name: 'Puja Samogri',
    slug: 'puja-samogri',
    image: 'https://images.unsplash.com/photo-1609941189988-b2f7c9e2d4a6?w=400&h=400&fit=crop',
    description: 'Essential items for your puja rituals',
    productCount: 56,
  },
  {
    id: '5',
    name: 'Oil & Ghee',
    slug: 'oil-ghee',
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&h=400&fit=crop',
    description: 'Pure ghee and traditional cooking oils',
    productCount: 18,
  },
  {
    id: '6',
    name: 'Seasonal Specials',
    slug: 'seasonal-specials',
    image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400&h=400&fit=crop',
    description: 'Limited edition seasonal Bengali delicacies',
    productCount: 24,
  },
  {
    id: '7',
    name: 'Books & Magazines',
    slug: 'books-magazines',
    image: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=400&h=400&fit=crop',
    description: 'Bengali literature and cultural magazines',
    productCount: 67,
  },
  {
    id: '8',
    name: 'Kitchen Utilities',
    slug: 'kitchen-utilities',
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop',
    description: 'Traditional Bengali kitchen essentials',
    productCount: 34,
  },
];

export const products: Product[] = [
  {
    id: '1',
    name: 'Dulal Chandra Bhar Palm Candy (Tal Michri)',
    slug: 'dulal-chandra-bhar-palm-candy-tal-michri-1kg',
    price: 206,
    originalPrice: 249,
    category: 'Snacks & Homemade Pickles',
    categorySlug: 'snacks-homemade-pickles',
    image: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=600&h=600&fit=crop',
    description: 'Authentic Tal Michri (Palm Candy) from the renowned Dulal Chandra Bhar. This traditional Bengali sweet is made from pure palm jaggery, carefully crystallized to create a natural and healthy sweetener.',
    ingredients: 'Pure Palm Jaggery (100% Natural)',
    howToUse: 'Use as a sweetener in tea, milk, or enjoy as a healthy candy. Perfect for adding authentic Bengali flavor to your sweets.',
    shippingInfo: 'Ships within 2-3 business days. Packed fresh with moisture-proof packaging.',
    stockStatus: 'in-stock',
    rating: 4.8,
    reviewCount: 124,
    isBestseller: true,
  },
  {
    id: '2',
    name: 'Homemade Mango Pickle (Aam ka Achar)',
    slug: 'homemade-mango-pickle-500g',
    price: 189,
    originalPrice: 220,
    category: 'Snacks & Homemade Pickles',
    categorySlug: 'snacks-homemade-pickles',
    image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=600&h=600&fit=crop',
    description: 'Traditional homemade mango pickle prepared with authentic Bengali recipe. Sun-dried raw mangoes pickled with mustard oil and aromatic spices.',
    ingredients: 'Raw Mango, Mustard Oil, Mustard Seeds, Fenugreek, Red Chili, Salt, Turmeric',
    howToUse: 'Perfect accompaniment with dal-rice, paratha, or any Indian meal.',
    shippingInfo: 'Ships within 2-3 business days in airtight glass jars.',
    stockStatus: 'in-stock',
    rating: 4.7,
    reviewCount: 89,
    isBestseller: true,
  },
  {
    id: '3',
    name: 'Bengali Chanachur Mix (500g)',
    slug: 'bengali-chanachur-mix-500g',
    price: 149,
    category: 'Snacks & Homemade Pickles',
    categorySlug: 'snacks-homemade-pickles',
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&h=600&fit=crop',
    description: 'Crispy and spicy Bengali Chanachur - the perfect teatime snack. Made with a mix of fried lentils, peanuts, and special Bengali spices.',
    ingredients: 'Besan, Rice Flakes, Peanuts, Gram Dal, Spices, Salt, Mustard Oil',
    howToUse: 'Enjoy as a snack with chai or sprinkle over your favorite jhalmuri.',
    shippingInfo: 'Ships within 1-2 business days. Freshly packed.',
    stockStatus: 'in-stock',
    rating: 4.5,
    reviewCount: 67,
    isBestseller: true,
  },
  {
    id: '4',
    name: 'Nolen Gur Sandesh (12 pcs)',
    slug: 'nolen-gur-sandesh-12pcs',
    price: 450,
    originalPrice: 520,
    category: 'Sweets & Mishti',
    categorySlug: 'sweets-mishti',
    image: 'https://images.unsplash.com/photo-1606471191009-63994c53433b?w=600&h=600&fit=crop',
    description: 'Authentic Bengali Sandesh made with fresh cottage cheese and Nolen Gur (Date Palm Jaggery). A seasonal delicacy available only during winter months.',
    ingredients: 'Fresh Chenna (Cottage Cheese), Nolen Gur (Date Palm Jaggery)',
    howToUse: 'Serve chilled as a dessert. Best consumed within 3 days.',
    shippingInfo: 'Special cold-chain shipping available. Orders ship same day if placed before 2 PM.',
    stockStatus: 'in-stock',
    rating: 4.9,
    reviewCount: 203,
    isBestseller: true,
    isNew: true,
  },
  {
    id: '5',
    name: 'Gobindobhog Rice (5kg)',
    slug: 'gobindobhog-rice-5kg',
    price: 649,
    originalPrice: 750,
    category: 'Lentils/Dal & Rice',
    categorySlug: 'lentils-dal-rice',
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&h=600&fit=crop',
    description: 'Premium Gobindobhog rice - the aromatic short-grain rice used in traditional Bengali pujas and special occasions. Known for its sweet fragrance and soft texture.',
    ingredients: '100% Gobindobhog Rice',
    howToUse: 'Perfect for Bhog, Payesh, and Pulao. Wash and soak for 30 minutes before cooking.',
    shippingInfo: 'Ships within 2-3 business days.',
    stockStatus: 'in-stock',
    rating: 4.8,
    reviewCount: 156,
    isBestseller: true,
  },
  {
    id: '6',
    name: 'Pure Cow Ghee (1 Litre)',
    slug: 'pure-cow-ghee-1litre',
    price: 850,
    originalPrice: 999,
    category: 'Oil & Ghee',
    categorySlug: 'oil-ghee',
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600&h=600&fit=crop',
    description: 'Pure desi cow ghee made using traditional Bilona method. Rich in flavor and aroma, perfect for Bengali cooking and puja rituals.',
    ingredients: '100% Pure Cow Milk Ghee',
    howToUse: 'Use for cooking, in sweets, or add to hot rice. Perfect for all Bengali recipes.',
    shippingInfo: 'Ships within 1-2 business days.',
    stockStatus: 'in-stock',
    rating: 4.9,
    reviewCount: 312,
    isBestseller: true,
  },
  {
    id: '7',
    name: 'Puja Dhoop Sticks (Pack of 100)',
    slug: 'puja-dhoop-sticks-100',
    price: 129,
    category: 'Puja Samogri',
    categorySlug: 'puja-samogri',
    image: 'https://images.unsplash.com/photo-1609941189988-b2f7c9e2d4a6?w=600&h=600&fit=crop',
    description: 'Premium quality dhoop sticks with traditional fragrance. Perfect for daily puja and special occasions.',
    ingredients: 'Natural herbs, Charcoal, Essential oils, Sandalwood powder',
    howToUse: 'Light the tip and let it burn for a few seconds, then blow out the flame.',
    shippingInfo: 'Ships within 1-2 business days.',
    stockStatus: 'in-stock',
    isBestseller: true,
  },
  {
    id: '8',
    name: 'Bengali Nimki (400g)',
    slug: 'bengali-nimki-400g',
    price: 99,
    category: 'Snacks & Homemade Pickles',
    categorySlug: 'snacks-homemade-pickles',
    image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=600&h=600&fit=crop',
    description: 'Crispy diamond-shaped Bengali snack made with refined flour and cumin seeds. A perfect teatime treat.',
    ingredients: 'Refined Flour, Cumin Seeds, Salt, Vegetable Oil',
    howToUse: 'Enjoy as a snack with tea or as a side with meals.',
    shippingInfo: 'Ships within 1-2 business days.',
    stockStatus: 'in-stock',
    rating: 4.4,
    reviewCount: 45,
    isBestseller: true,
  },
  {
    id: '9',
    name: 'Rosogolla (1kg Tin)',
    slug: 'rosogolla-1kg-tin',
    price: 380,
    originalPrice: 450,
    category: 'Sweets & Mishti',
    categorySlug: 'sweets-mishti',
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&h=600&fit=crop',
    description: 'Authentic Bengali Rosogolla - soft, spongy cheese balls soaked in light sugar syrup. The original GI-tagged Bengal Rosogolla.',
    ingredients: 'Fresh Chenna, Sugar, Water, Cardamom',
    howToUse: 'Serve chilled or at room temperature. Best within 7 days of opening.',
    shippingInfo: 'Ships within 2-3 business days.',
    stockStatus: 'in-stock',
    rating: 4.7,
    reviewCount: 189,
    isBestseller: true,
  },
  {
    id: '10',
    name: 'Masoor Dal (1kg)',
    slug: 'masoor-dal-1kg',
    price: 145,
    category: 'Lentils/Dal & Rice',
    categorySlug: 'lentils-dal-rice',
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&h=600&fit=crop',
    description: 'Premium quality Masoor Dal. Quick-cooking lentils perfect for everyday Bengali meals.',
    ingredients: '100% Masoor Dal',
    howToUse: 'Wash and cook with water. Ready in 15-20 minutes.',
    shippingInfo: 'Ships within 1-2 business days.',
    stockStatus: 'out-of-stock',
    rating: 4.6,
    reviewCount: 78,
    isBestseller: true,
  },
  {
    id: '11',
    name: 'Kasundi Mustard Sauce (250ml)',
    slug: 'kasundi-mustard-sauce-250ml',
    price: 175,
    category: 'Snacks & Homemade Pickles',
    categorySlug: 'snacks-homemade-pickles',
    image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=600&h=600&fit=crop',
    description: 'Authentic Bengali Kasundi - fermented mustard sauce with a tangy, spicy flavor. A must-have condiment for fish dishes.',
    ingredients: 'Mustard Seeds, Mango, Turmeric, Red Chili, Salt, Mustard Oil',
    howToUse: 'Perfect with fish fry, pakoras, or as a sandwich spread.',
    shippingInfo: 'Ships within 2-3 business days.',
    stockStatus: 'in-stock',
    rating: 4.8,
    reviewCount: 92,
    isBestseller: true,
  },
  {
    id: '12',
    name: 'Ghugni Masala Mix (200g)',
    slug: 'ghugni-masala-mix-200g',
    price: 89,
    category: 'Snacks & Homemade Pickles',
    categorySlug: 'snacks-homemade-pickles',
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&h=600&fit=crop',
    description: 'Ready-to-use spice mix for making authentic Bengali Ghugni. Just add to boiled yellow peas!',
    ingredients: 'Cumin, Coriander, Red Chili, Garam Masala, Turmeric, Dried Mango Powder',
    howToUse: 'Add 2 tbsp to boiled yellow peas, cook for 5 minutes.',
    shippingInfo: 'Ships within 1-2 business days.',
    stockStatus: 'out-of-stock',
    isBestseller: true,
  },
  // Upcoming products
  {
    id: '13',
    name: 'Nolen Gur Ice Cream (500ml)',
    slug: 'nolen-gur-ice-cream-500ml',
    price: 350,
    category: 'Sweets & Mishti',
    categorySlug: 'sweets-mishti',
    image: 'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=600&h=600&fit=crop',
    description: 'Creamy artisanal ice cream made with authentic Nolen Gur (Date Palm Jaggery). A winter special that brings the taste of Bengal in every scoop.',
    ingredients: 'Fresh Cream, Milk, Nolen Gur, Sugar',
    howToUse: 'Serve frozen. Best consumed within 2 weeks of purchase.',
    shippingInfo: 'Special frozen shipping available. Coming soon!',
    stockStatus: 'upcoming',
    isNew: true,
  },
  {
    id: '14',
    name: 'Bengali Fish Pickle (250g)',
    slug: 'bengali-fish-pickle-250g',
    price: 299,
    category: 'Snacks & Homemade Pickles',
    categorySlug: 'snacks-homemade-pickles',
    image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=600&h=600&fit=crop',
    description: 'Traditional Bengali fish pickle made with fresh rohu fish, mustard oil, and aromatic spices. A rare delicacy from the heart of Bengal.',
    ingredients: 'Rohu Fish, Mustard Oil, Panch Phoron, Red Chili, Turmeric, Salt',
    howToUse: 'Enjoy with hot rice or as a side dish. Store in refrigerator.',
    shippingInfo: 'Special packaging for extended freshness. Coming soon!',
    stockStatus: 'upcoming',
  },
  {
    id: '15',
    name: 'Durga Puja Special Gift Box',
    slug: 'durga-puja-special-gift-box',
    price: 1499,
    originalPrice: 1799,
    category: 'Seasonal Specials',
    categorySlug: 'seasonal-specials',
    image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=600&h=600&fit=crop',
    description: 'A curated gift box featuring the finest Bengali festive treats. Perfect for gifting during Durga Puja celebrations. Includes premium sweets, snacks, and puja essentials.',
    ingredients: 'Assorted Bengali Sweets, Chanachur, Nimki, Dhoop Sticks, Sindoor',
    howToUse: 'Perfect as a gift for family and friends during the festive season.',
    shippingInfo: 'Pre-orders open soon. Limited edition boxes available.',
    stockStatus: 'upcoming',
    isNew: true,
  },
];

export const bestsellers = products.filter((p) => p.isBestseller);

export const upcomingProducts = products.filter((p) => p.stockStatus === 'upcoming');

export const getProductBySlug = (slug: string): Product | undefined => {
  return products.find((p) => p.slug === slug);
};

export const getProductsByCategory = (categorySlug: string): Product[] => {
  return products.filter((p) => p.categorySlug === categorySlug);
};

export const getCategoryBySlug = (slug: string): Category | undefined => {
  return categories.find((c) => c.slug === slug);
};
