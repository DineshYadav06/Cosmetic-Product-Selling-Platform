import { NextResponse } from 'next/server';
import connectToDatabase from "@/lib/mongodb";
import Product from "@/lib/models/Product";

const PRODUCTS = [
  // ── BESTSELLERS ────────────────────────────────────────────────────────────
  {
    brand: 'Lakme',
    name: 'Absolute Matte Revolution Lip Color – Red Rust',
    price: 549,
    originalPrice: 799,
    image: 'https://images.unsplash.com/photo-1586495777744-4e6232bf2262?auto=format&fit=crop&q=80&w=600',
    description: 'Long-lasting matte lipstick with rich pigment and comfortable wear. Zero feathering formula.',
    rating: 4.5,
    reviews: 2841,
    category: 'Bestsellers',
    inStock: true,
  },
  {
    brand: 'Maybelline',
    name: 'Fit Me Matte + Poreless Foundation – Nude 120',
    price: 475,
    originalPrice: 699,
    image: 'https://images.unsplash.com/photo-1631730486572-226d1f595b68?auto=format&fit=crop&q=80&w=600',
    description: 'Lightweight, buildable coverage that controls shine and minimizes pores for a fresh look.',
    rating: 4.4,
    reviews: 5123,
    category: 'Bestsellers',
    inStock: true,
  },
  {
    brand: "L'Oreal Paris",
    name: 'Revitalift Hyaluronic Acid Serum 1.5%',
    price: 899,
    originalPrice: 1299,
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=600',
    description: 'Pure 1.5% hyaluronic acid serum that plumps and hydrates skin in just 1 week.',
    rating: 4.6,
    reviews: 3677,
    category: 'Bestsellers',
    inStock: true,
  },
  {
    brand: 'Nykaa',
    name: 'SkinShield Anti-Pollution Matte Sunscreen SPF 50+',
    price: 399,
    originalPrice: 599,
    image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&q=80&w=600',
    description: 'Lightweight sunscreen with PA++++ protection that doubles as a primer. Blue-light shield included.',
    rating: 4.3,
    reviews: 8912,
    category: 'Bestsellers',
    inStock: true,
  },
  {
    brand: 'Biotique',
    name: 'Bio Coconut Whitening & Brightening Cream',
    price: 249,
    originalPrice: 380,
    image: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&q=80&w=600',
    description: 'Ayurvedic brightening cream with coconut milk and white orchid extracts. Dermatologist tested.',
    rating: 4.2,
    reviews: 6548,
    category: 'Bestsellers',
    inStock: true,
  },
  {
    brand: 'Himalaya',
    name: 'Clear Complexion Brightening Turmeric Face Wash',
    price: 179,
    originalPrice: 220,
    image: 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?auto=format&fit=crop&q=80&w=600',
    description: 'Turmeric-powered gentle face wash that clears blemishes and gives a radiant glow.',
    rating: 4.1,
    reviews: 12430,
    category: 'Bestsellers',
    inStock: true,
  },
  {
    brand: 'The Derma Co.',
    name: '2% Salicylic Acid Face Serum for Acne & Open Pores',
    price: 449,
    originalPrice: 699,
    image: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&q=80&w=600',
    description: 'Clinical-strength salicylic acid serum that unclogs pores and fades acne marks visibly.',
    rating: 4.5,
    reviews: 4219,
    category: 'Bestsellers',
    inStock: true,
  },

  // ── JUST DROPPED ───────────────────────────────────────────────────────────
  {
    brand: 'Charlotte Tilbury',
    name: 'Magic Cream Moisturizer 50ml – Luxury Edition',
    price: 4999,
    originalPrice: 6500,
    image: 'https://images.unsplash.com/photo-1583209814683-c81379428101?auto=format&fit=crop&q=80&w=600',
    description: "Hollywood's favourite multi-award-winning moisturiser, now available in India. Feel the magic.",
    rating: 4.8,
    reviews: 1892,
    category: 'Just Dropped',
    inStock: true,
  },
  {
    brand: 'Huda Beauty',
    name: 'GloWish Multi-Dew Skin Tint SPF 30 – Shade 02 Fair',
    price: 2799,
    originalPrice: 3499,
    image: 'https://images.unsplash.com/photo-1547887538-e3a2f32cb1cc?auto=format&fit=crop&q=80&w=600',
    description: 'Weightless skin tint with buildable coverage, SPF 30, and a lit-from-within glow.',
    rating: 4.7,
    reviews: 763,
    category: 'Just Dropped',
    inStock: true,
  },
  {
    brand: 'Rare Beauty',
    name: 'Soft Pinch Liquid Blush – Joy (Coral)',
    price: 1899,
    originalPrice: 2499,
    image: 'https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?auto=format&fit=crop&q=80&w=600',
    description: 'A little goes a long way. Weightless liquid blush that blends effortlessly into skin.',
    rating: 4.9,
    reviews: 2134,
    category: 'Just Dropped',
    inStock: true,
  },
  {
    brand: 'Fenty Beauty',
    name: "Pro Filt'r Soft Matte Longwear Foundation – 185 W",
    price: 3299,
    originalPrice: 4100,
    image: 'https://images.unsplash.com/photo-1522338242992-e1a54906a8da?auto=format&fit=crop&q=80&w=600',
    description: 'Transfer-proof, sweat-proof foundation in 50 inclusive shades. Photographed all day.',
    rating: 4.6,
    reviews: 987,
    category: 'Just Dropped',
    inStock: true,
  },
  {
    brand: 'Minimalist',
    name: 'Retinol 0.3% + Peptide Night Cream',
    price: 699,
    originalPrice: 999,
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=600',
    description: 'Dermatologist-backed retinol cream with peptides that visibly reduces fine lines overnight.',
    rating: 4.4,
    reviews: 3102,
    category: 'Just Dropped',
    inStock: true,
  },
  {
    brand: 'Plum',
    name: 'Green Tea Pore Cleansing Face Wash',
    price: 329,
    originalPrice: 449,
    image: 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?auto=format&fit=crop&q=80&w=600',
    description: 'Vegan, 100% soap-free formula with green tea & glycolic acid. Controls oil & unclogs pores.',
    rating: 4.3,
    reviews: 7811,
    category: 'Just Dropped',
    inStock: true,
  },

  // ── SKINCARE ────────────────────────────────────────────────────────────────
  {
    brand: "Dot & Key",
    name: 'Watermelon Hyaluronic Cooling Toner',
    price: 449,
    originalPrice: 649,
    image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&q=80&w=600',
    description: 'Pore-tightening toner packed with watermelon extract and hyaluronic acid for dewy skin.',
    rating: 4.4,
    reviews: 2983,
    category: 'Skincare',
    inStock: true,
  },
  {
    brand: 'Mamaearth',
    name: 'Vitamin C Face Cream with Turmeric SPF 20',
    price: 349,
    originalPrice: 499,
    image: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&q=80&w=600',
    description: 'Daily moisturizer that brightens, protects from UV, and fades dark spots with Vitamin C.',
    rating: 4.2,
    reviews: 15234,
    category: 'Skincare',
    inStock: true,
  },
  {
    brand: 'Cetaphil',
    name: 'Moisturising Lotion for Sensitive Skin 250ml',
    price: 599,
    originalPrice: 799,
    image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&q=80&w=600',
    description: 'Clinically proven gentle lotion for sensitive, dry skin. Non-comedogenic & fragrance-free.',
    rating: 4.7,
    reviews: 22100,
    category: 'Skincare',
    inStock: true,
  },

  // ── MAKEUP ──────────────────────────────────────────────────────────────────
  {
    brand: 'MAC',
    name: 'Studio Fix Fluid SPF 15 Foundation – NC15',
    price: 2699,
    originalPrice: 3200,
    image: 'https://images.unsplash.com/photo-1522338242992-e1a54906a8da?auto=format&fit=crop&q=80&w=600',
    description: 'Full-coverage liquid foundation with SPF 15. 24-hour wear with matte finish.',
    rating: 4.5,
    reviews: 4412,
    category: 'Makeup',
    inStock: true,
  },
  {
    brand: 'Colorbar',
    name: 'Just Kissed Lip & Cheek Stain – Just Rosy',
    price: 475,
    originalPrice: 699,
    image: 'https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?auto=format&fit=crop&q=80&w=600',
    description: 'Dual-use tint for lips and cheeks. Buildable, long-lasting rosy flush that looks natural.',
    rating: 4.3,
    reviews: 1876,
    category: 'Makeup',
    inStock: true,
  },
  {
    brand: 'Sugar Cosmetics',
    name: 'Smudge Me Not Liquid Lipstick – 18 Berry Cosmo',
    price: 599,
    originalPrice: 849,
    image: 'https://images.unsplash.com/photo-1586495777744-4e6232bf2262?auto=format&fit=crop&q=80&w=600',
    description: 'Ultra-matte, transfer-proof liquid lipstick. 12-hour wear with 50+ vibrant shades.',
    rating: 4.4,
    reviews: 9342,
    category: 'Makeup',
    inStock: true,
  },
  {
    brand: 'Lakme',
    name: '9to5 Weightless Mousse Foundation – Ivory Cream W100',
    price: 429,
    originalPrice: 649,
    image: 'https://images.unsplash.com/photo-1631730486572-226d1f595b68?auto=format&fit=crop&q=80&w=600',
    description: 'Airy mousse foundation for 16-hour natural finish. Oil-free and breathable for Indian climate.',
    rating: 4.1,
    reviews: 7204,
    category: 'Makeup',
    inStock: true,
  },
];

export async function GET() {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Seed not allowed in production' }, { status: 403 });
  }

  try {
    const conn = await connectToDatabase();
    if (!conn) {
      return NextResponse.json({ error: 'Database connection failed' }, { status: 503 });
    }

    // Clear existing products and re-seed
    await Product.deleteMany({});
    const inserted = await Product.insertMany(PRODUCTS);

    return NextResponse.json({
      success: true,
      message: `✅ ${inserted.length} products seeded successfully!`,
      count: inserted.length,
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error('[seed error]', msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
