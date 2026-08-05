import { NextResponse } from 'next/server';
import connectToDatabase from "@/lib/mongodb";
import SiteSettings from "@/lib/models/SiteSettings";

export async function GET() {
  try {
    await connectToDatabase();
    let settings = await SiteSettings.findOne({});
    if (!settings) {
      settings = await SiteSettings.create({});
    }
    return NextResponse.json(settings);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    await connectToDatabase();
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
