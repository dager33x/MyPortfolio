import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

export type ContactMessageBody = {
  name?: string;
  email?: string;
  message?: string;
};

export type ContactMessage = {
  id: string;
  name: string;
  email: string;
  message: string;
  receivedAt: string;
};

const dataDirectory = path.join(process.cwd(), "data");
const messagesFile = path.join(dataDirectory, "messages.json");

async function ensureMessagesFile() {
  await mkdir(dataDirectory, { recursive: true });
}

export async function readMessages() {
  try {
    const content = await readFile(messagesFile, "utf-8");
    return JSON.parse(content) as ContactMessage[];
  } catch {
    await ensureMessagesFile();
    await writeFile(messagesFile, JSON.stringify([], null, 2));
    return [];
  }
}

export async function saveMessage(body: Required<ContactMessageBody>) {
  const messages = await readMessages();
  const message: ContactMessage = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    name: body.name.trim(),
    email: body.email.trim(),
    message: body.message.trim(),
    receivedAt: new Date().toISOString()
  };

  messages.unshift(message);
  await ensureMessagesFile();
  await writeFile(messagesFile, JSON.stringify(messages, null, 2));
  return message;
}

export async function deleteMessage(id: string) {
  const messages = await readMessages();
  const nextMessages = messages.filter((message) => message.id !== id);

  if (nextMessages.length === messages.length) {
    return false;
  }

  await ensureMessagesFile();
  await writeFile(messagesFile, JSON.stringify(nextMessages, null, 2));
  return true;
}
