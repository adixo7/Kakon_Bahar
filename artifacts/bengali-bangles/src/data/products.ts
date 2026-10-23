export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
}

const basePath = import.meta.env.BASE_URL.replace(/\/$/, '');

export const categories = [
  'All bangles',
  'Mirror work',
  'Embellished',
  'Gold tone',
  'Wrapped',
];

export const bangleSizes = ['2.4', '2.6', '2.8', '2.10'] as const;
export type BangleSize = (typeof bangleSizes)[number];

export const products: Product[] = [
  {
    id: 1,
    name: 'Blue Mirrorwork Stack',
    description: 'Blue, white, and ochre wraps with mirror accents.',
    price: 120,
    category: 'Mirror work',
    image: `${basePath}/products/blue-mirrorwork-stack.webp`,
  },
  {
    id: 2,
    name: 'Maroon & Ivory Embellished Set',
    description: 'Maroon and ivory bangles with jewel-style details.',
    price: 120,
    category: 'Embellished',
    image: `${basePath}/products/maroon-ivory-embellished-set.webp`,
  },
  {
    id: 3,
    name: 'Mustard Embellished Pair',
    description: 'Mustard wraps with floral jewel-style accents.',
    price: 120,
    category: 'Gold tone',
    image: `${basePath}/products/mustard-embellished-pair.webp`,
  },
  {
    id: 4,
    name: 'Multicolor Wrapped Stack',
    description: 'Colorful wrapped bangles with gold-tone bands.',
    price: 120,
    category: 'Wrapped',
    image: `${basePath}/products/multicolor-wrapped-stack.webp`,
  },
  {
    id: 5,
    name: 'Midnight Blue Floral Pair',
    description: 'Navy bangles with gold-tone bands and floral details.',
    price: 120,
    category: 'Embellished',
    image: `${basePath}/products/midnight-blue-floral-pair.webp`,
  },
];
