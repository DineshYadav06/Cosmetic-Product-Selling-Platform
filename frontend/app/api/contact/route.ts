import { NextResponse } from 'next/server';
import connectToDatabase from "@/lib/mongodb";
import { Contact } from "@/lib/models/Contact";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { firstName, lastName, email, subject, message } = body;

    if (!firstName || !lastName || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const newContact = await (Contact as any).create({
      firstName,
      lastName,
      email,
      subject,
      message,
    });

    return NextResponse.json(
      { message: 'Message sent successfully', contact: newContact },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    );
  }
}
