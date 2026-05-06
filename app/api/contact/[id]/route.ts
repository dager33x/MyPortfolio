import { NextResponse } from "next/server";
import { deleteMessage } from "../../../../lib/contact-messages";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function DELETE(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  const deleted = await deleteMessage(id);

  if (!deleted) {
    return NextResponse.json({ error: "Message not found." }, { status: 404 });
  }

  return new Response(null, { status: 204 });
}
