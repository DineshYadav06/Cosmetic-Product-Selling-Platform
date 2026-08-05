import { NextResponse } from 'next/server';
import connectToDatabase from "@/lib/mongodb";
import Product from "@/lib/models/Product";
import fs from 'fs';
import path from 'path';

function parseCSVLine(line: string) {
  const result = [];
  let cur = '';
  let inQuote = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') inQuote = !inQuote;
    else if (char === ',' && !inQuote) {
      result.push(cur.trim());
      cur = '';
    } else {
      cur += char;
    }
  }
  result.push(cur.trim());
  return result;
}

const CATEGORY_IMAGES: { [key: string]: string } = {
  'perfume': 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=80&w=600',
  'fragrance': 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=80&w=600',
  'bodywash': 'https://images.unsplash.com/photo-1600857062241-98e5dba7f214?auto=format&fit=crop&q=80&w=600',
  'soap': 'https://images.unsplash.com/photo-1600857062241-98e5dba7f214?auto=format&fit=crop&q=80&w=600',
  'face': 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80&w=600',
  'skincare': 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80&w=600',
  'makeup': 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=80&w=600',
  'lips': 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&q=80&w=600',
};

export async function GET() {
  try {
    const conn = await connectToDatabase();
    if (!conn) {
      return NextResponse.json({ error: "Database connection failed" }, { status: 500 });
    }
    
    const csvPath = path.join(process.cwd(), 'public', 'product data', 'product CSV', 'E-commerce  cosmetic dataset.csv');
    const fileContent = fs.readFileSync(csvPath, 'utf8');
    const lines = fileContent.split('\n');
    
    const headers = parseCSVLine(lines[0]);
    const nameIdx = headers.indexOf('product_name');
    const brandIdx = headers.indexOf('brand');
    const priceIdx = headers.indexOf('price');
    const categoryIdx = headers.indexOf('category');
    const subIdx = headers.indexOf('subcategory');
    const ingredientsIdx = headers.indexOf('ingredients');
    const ratingIdx = headers.indexOf('rating');
    const reviewsIdx = headers.indexOf('noofratings');

    const BATCH_SIZE = 200;
    let productsToInsert = [];
    let totalImported = 0;
    const MAX_ROWS = 2000; 
    
    for (let i = 1; i < Math.min(lines.length, MAX_ROWS); i++) {
      if (!lines[i].trim()) continue;
      
      const values = parseCSVLine(lines[i]);
      if (values.length < headers.length) continue;

      const subcat = values[subIdx]?.toLowerCase() || '';
      const cat = values[categoryIdx]?.toLowerCase() || 'Skincare';
      
      let imageUrl = CATEGORY_IMAGES[subcat] || CATEGORY_IMAGES[cat] || 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80&w=600';

      const price = parseFloat(values[priceIdx]) || 999;

      productsToInsert.push({
        name: values[nameIdx],
        brand: values[brandIdx] || 'Glowmart Artisan',
        price: price,
        originalPrice: Math.round(price * 1.4),
        image: imageUrl,
        description: values[ingredientsIdx] || `A premium ${subcat} product from our exclusive ${values[brandIdx]} collection.`,
        category: values[categoryIdx] === 'body' ? 'Fragrance' : 'Skincare',
        rating: parseFloat(values[ratingIdx]) || 4.5,
        reviews: parseInt(values[reviewsIdx]?.replace(/,/g, '')) || 0,
        inStock: true,
        stockCount: 100,
        skinType: ["Normal", "Dry", "Oily", "Combination"],
        concerns: ["Dullness", "Hydration"]
      });

      // Insert in batches
      if (productsToInsert.length >= BATCH_SIZE) {
        await Product.insertMany(productsToInsert);
        totalImported += productsToInsert.length;
        productsToInsert = [];
      }
    }

    // Final batch
    if (productsToInsert.length > 0) {
      await Product.insertMany(productsToInsert);
      totalImported += productsToInsert.length;
    }

    return NextResponse.json({ 
      success: true, 
      message: `Imported ALL ${totalImported} products from CSV`,
      total: totalImported
    });

  } catch (error: any) {
    console.error("Seed Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
