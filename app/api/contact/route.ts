import { NextResponse } from "next/server";
import { readMessages, saveMessage, type ContactMessageBody } from "../../../lib/contact-messages";

export async function GET() {
  const messages = await readMessages();
  return NextResponse.json(messages);
}

export async function POST(request: Request) {
  const { name, email, message } = (await request.json()) as ContactMessageBody;

  if (!name?.trim() || !email?.trim() || !message?.trim()) {
    return NextResponse.json(
      { error: "Name, email, and message are required." },
      { status: 400 }
    );
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    return NextResponse.json(
      { error: "Please provide a valid email address." },
      { status: 400 }
    );
  }

  await saveMessage({ name, email, message });

  return NextResponse.json(
    { message: "Message received. Thank you for reaching out." },
    { status: 202 }
  );
}
