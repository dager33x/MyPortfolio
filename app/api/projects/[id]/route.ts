import { NextResponse } from "next/server";
import { readProjects, saveProjects, validateProject } from "../../../../lib/portfolio-data";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PUT(request: Request, context: RouteContext) {
  const { id } = await context.params;
  const project = validateProject({ ...(await request.json()), id });

  if (!project) {
    return NextResponse.json(
      { error: "Title, description, and at least one technology are required." },
      { status: 400 }
    );
  }

  const projects = await readProjects();
  const existingIndex = projects.findIndex((item) => item.id === id);

  if (existingIndex === -1) {
    return NextResponse.json({ error: "Project not found." }, { status: 404 });
  }

  const nextProjects = [...projects];
  nextProjects[existingIndex] = project;

  await saveProjects(nextProjects);
  return NextResponse.json(project);
}

export async function DELETE(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  const projects = await readProjects();
  const nextProjects = projects.filter((project) => project.id !== id);

  if (nextProjects.length === projects.length) {
    return NextResponse.json({ error: "Project not found." }, { status: 404 });
  }

  await saveProjects(nextProjects);
  return new Response(null, { status: 204 });
}
