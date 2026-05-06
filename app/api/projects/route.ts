import { NextResponse } from "next/server";
import { readProjects, saveProjects, validateProject } from "../../../lib/portfolio-data";

export const dynamic = "force-dynamic";

export async function GET() {
  const projects = await readProjects();
  return NextResponse.json(projects, {
    headers: { "Cache-Control": "no-store" }
  });
}

export async function POST(request: Request) {
  const project = validateProject(await request.json());

  if (!project) {
    return NextResponse.json(
      { error: "Title, description, and at least one technology are required." },
      { status: 400 }
    );
  }

  const projects = await readProjects();
  const uniqueId = projects.some((item) => item.id === project.id)
    ? `${project.id}-${Date.now()}`
    : project.id;
  const nextProject = { ...project, id: uniqueId };

  await saveProjects([nextProject, ...projects]);
  return NextResponse.json(nextProject, { status: 201 });
}
