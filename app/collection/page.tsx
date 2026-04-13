import Header from "../../components/Header";
import Footer from "../../components/Footer";
import connectToDatabase from "../../lib/mongodb";
import Product from "../../lib/models/Product";
import CollectionInteractive from "../../components/CollectionInteractive";

const MOCK_PRODUCTS = [
  { id: "1", brand: "Fenty Beauty", name: "Pro Filt'r Soft Matte Longwear Foundation", price: 3200, originalPrice: 3800, image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=80&w=500", rating: 4.8, reviews: 1240, category: "Makeup" },
  { id: "2", brand: "Rare Beauty", name: "Soft Pinch Liquid Blush - Joy", price: 1850, originalPrice: 2200, image: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&q=80&w=500", rating: 4.9, reviews: 3120, category: "Makeup" },
  { id: "3", brand: "Charlotte Tilbury", name: "Pillow Talk Lipstick - Original", price: 2900, originalPrice: 3400, image: "https://images.unsplash.com/photo-1596704017234-0b761be5b269?auto=format&fit=crop&q=80&w=500", rating: 4.7, reviews: 890, category: "Makeup" },
  { id: "4", brand: "The Ordinary", name: "Hyaluronic Acid 2% + B5 Serum 30ml", price: 650, originalPrice: 850, image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=500", rating: 4.6, reviews: 5670, category: "Skincare" },
  { id: "5", brand: "Dior", name: "Sauvage Eau De Parfum 100ml", price: 11500, originalPrice: 13000, image: "https://images.unsplash.com/photo-1523293111662-bf24f2225900?auto=format&fit=crop&q=80&w=500", rating: 4.9, reviews: 2100, category: "Fragrance" },
  { id: "6", brand: "Huda Beauty", name: "GloWish Multidew Skin Tint Foundation", price: 2750, originalPrice: 3200, image: "https://images.unsplash.com/photo-1631214500004-8c1b0ce76b3d?auto=format&fit=crop&q=80&w=500", rating: 4.5, reviews: 720, category: "Makeup" },
  { id: "7", brand: "Cetaphil", name: "Gentle Skin Cleanser 500ml", price: 480, originalPrice: 580, image: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?auto=format&fit=crop&q=80&w=500", rating: 4.7, reviews: 8900, category: "Skincare" },
  { id: "8", brand: "MAC", name: "Studio Waterweight Foundation SPF 30", price: 1600, originalPrice: 1900, image: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&q=80&w=500", rating: 4.8, reviews: 4500, category: "Makeup" },
  { id: "9", brand: "Lakme", name: "9to5 Weightless Mousse Foundation", price: 350, originalPrice: 450, image: "https://images.unsplash.com/photo-1631214423634-4986d2232a8b?auto=format&fit=crop&q=80&w=500", rating: 4.3, reviews: 6700, category: "Makeup" },
  { id: "10", brand: "Tom Ford", name: "Ombré Leather All Over Body Spray 150ml", price: 18500, originalPrice: 21000, image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=500", rating: 4.9, reviews: 560, category: "Fragrance" },
  { id: "11", brand: "Nykaa", name: "Matte to Lustre Lipstick - Red Alert", price: 299, originalPrice: 399, image: "https://images.unsplash.com/photo-1561711589-b9cb8a3d2e1c?auto=format&fit=crop&q=80&w=500", rating: 4.2, reviews: 12300, category: "Makeup" },
  { id: "12", brand: "Minimalist", name: "10% Niacinamide Face Serum", price: 399, originalPrice: 499, image: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?auto=format&fit=crop&q=80&w=500", rating: 4.6, reviews: 9800, category: "Skincare" },
];

export default async function CollectionPage() {
  let products: any[] = [];
  try {
    await connectToDatabase();
    products = await Product.find({}).lean().sort({ createdAt: -1 });
  } catch (e) {
    console.warn("DB not connected, showing empty state");
  }

  // Use mock products as fallback when DB is empty format map to match new interactive interface
  const displayProducts = products.length > 0
    ? products.map((p: any) => ({
        id: p._id.toString(),
        brand: p.brand || "Brand",
        name: p.name,
        price: p.price,
        originalPrice: p.originalPrice,
        image: p.image,
        rating: p.rating || 4.5,
        reviews: p.reviews || 120,
        category: p.category || "General"
      }))
    : MOCK_PRODUCTS;

  return (
    <main className="min-h-screen bg-black text-white selection:bg-[#d4af37] selection:text-black">
      <Header />
      <CollectionInteractive products={displayProducts} />
      <Footer />
    </main>
  );
}
