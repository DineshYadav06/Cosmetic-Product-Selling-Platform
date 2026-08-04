import { NextResponse } from 'next/server';
import connectToDatabase from '../../../../lib/mongodb';
import SiteSettings from '../../../../lib/models/SiteSettings';

const DEFAULT_SETTINGS = {
  storeName: "Glowmart",
  supportEmail: "support@glowmart.com",
  announcementText: "Welcome to Glowmart - Premium Cosmetic Platform",
  heroOffer: "Up to 40% off on Luxury Fragrances",
  freeShippingThreshold: 999
};

export async function GET() {
  try {
    const conn = await connectToDatabase();
    if (!conn) {
      return NextResponse.json(DEFAULT_SETTINGS);
    }
    let settings = await SiteSettings.findOne({});
    if (!settings) {
      settings = await SiteSettings.create({});
    }
    return NextResponse.json(settings);
  } catch (error) {
    console.warn("Using fallback site settings due to DB error:", error);
    return NextResponse.json(DEFAULT_SETTINGS);
  }
}

export async function PUT(request: Request) {
  try {
    const conn = await connectToDatabase();
    if (!conn) {
      return NextResponse.json({ error: 'Database not connected. Cannot update settings.' }, { status: 503 });
    }
    const body = await request.json();
    
    let settings = await SiteSettings.findOne({});
    if (!settings) {
      settings = new SiteSettings(body);
    } else {
      settings.storeName = body.storeName ?? settings.storeName;
      settings.supportEmail = body.supportEmail ?? settings.supportEmail;
      settings.announcementText = body.announcementText ?? settings.announcementText;
      settings.heroOffer = body.heroOffer ?? settings.heroOffer;
      settings.freeShippingThreshold = body.freeShippingThreshold ?? settings.freeShippingThreshold;
    }
    
    await settings.save();
    return NextResponse.json({ success: true, settings });
  } catch(error) {
     return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  }
}

