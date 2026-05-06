import cors from "cors";
import express, { Request, Response } from "express";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const app = express();
const port = Number(process.env.PORT) || 4000;

app.use(cors({ origin: ["http://localhost:3000", "http://127.0.0.1:3000"] }));
app.use(express.json());

const dataDirectory = path.join(process.cwd(), "data");
const projectsFile = path.join(dataDirectory, "projects.json");

type ContactBody = {
  name?: string;
  email?: string;
  message?: string;
};

type ProjectBody = {
  id?: string;
  title?: string;
  description?: string;
  tech?: string[] | string;
  accent?: "cyan" | "violet" | "blue" | "green";
  image?: string;
  projectUrl?: string;
  codeUrl?: string;
};

type Project = Required<ProjectBody> & {
  id: string;
  tech: string[];
};

const starterProjects: Project[] = [
  {
    id: "tutor-match-system",
    title: "Tutor Match System",
    description:
      "A matching platform concept focused on connecting students with tutors through structured profiles, searchable skills, and reliable request flows.",
    tech: ["Node.js", "Express", "MySQL", "React"],
    accent: "cyan",
    image: "/tutor-match.png",
    projectUrl: "#",
    codeUrl: "#"
  },
  {
    id: "restomenu-system",
    title: "RestoMenu System",
    description:
      "A digital menu and ordering workflow designed for organized item management, fast browsing, and cleaner restaurant operations.",
    tech: ["TypeScript", "React", "Supabase", "Express"],
    accent: "violet",
    image: "/restomenu.png",
    projectUrl: "#",
    codeUrl: "#"
  }
];

function createSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function normalizeTech(tech: ProjectBody["tech"]) {
  if (Array.isArray(tech)) {
    return tech.map((item) => item.trim()).filter(Boolean);
  }

  return String(tech || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

async function readProjects() {
  try {
    const content = await readFile(projectsFile, "utf-8");
    return JSON.parse(content) as Project[];
  } catch {
    await mkdir(dataDirectory, { recursive: true });
    await writeFile(projectsFile, JSON.stringify(starterProjects, null, 2));
    return starterProjects;
  }
}

async function saveProjects(projects: Project[]) {
  await mkdir(dataDirectory, { recursive: true });
  await writeFile(projectsFile, JSON.stringify(projects, null, 2));
}

function validateProject(body: ProjectBody) {
  const title = body.title?.trim();
  const description = body.description?.trim();
  const tech = normalizeTech(body.tech);

  if (!title || !description || tech.length === 0) {
    return null;
  }

  return {
    id: body.id?.trim() || createSlug(title),
    title,
    description,
    tech,
    accent: body.accent || "cyan",
    image: body.image?.trim() || "",
    projectUrl: body.projectUrl?.trim() || "#",
    codeUrl: body.codeUrl?.trim() || "#"
  } satisfies Project;
}

app.get("/api/health", (_request: Request, response: Response) => {
  response.json({ status: "ok", service: "daryl-portfolio-api" });
});

app.get("/api/projects", async (_request: Request, response: Response) => {
  const projects = await readProjects();
  response.setHeader("Cache-Control", "no-store");
  response.json(projects);
});

app.post("/api/projects", async (request: Request<unknown, unknown, ProjectBody>, response: Response) => {
  const project = validateProject(request.body);

  if (!project) {
    return response.status(400).json({
      error: "Title, description, and at least one technology are required."
    });
  }

  const projects = await readProjects();
  const uniqueId = projects.some((item) => item.id === project.id)
    ? `${project.id}-${Date.now()}`
    : project.id;
  const nextProject = { ...project, id: uniqueId };
  const nextProjects = [nextProject, ...projects];

  await saveProjects(nextProjects);
  return response.status(201).json(nextProject);
});

app.put("/api/projects/:id", async (
  request: Request<{ id: string }, unknown, ProjectBody>,
  response: Response
) => {
  const project = validateProject({ ...request.body, id: request.params.id });

  if (!project) {
    return response.status(400).json({
      error: "Title, description, and at least one technology are required."
    });
  }

  const projects = await readProjects();
  const existingIndex = projects.findIndex((item) => item.id === request.params.id);

  if (existingIndex === -1) {
    return response.status(404).json({ error: "Project not found." });
  }

  const nextProjects = [...projects];
  nextProjects[existingIndex] = project;

  await saveProjects(nextProjects);
  return response.json(project);
});

app.delete("/api/projects/:id", async (request: Request<{ id: string }>, response: Response) => {
  const projects = await readProjects();
  const nextProjects = projects.filter((project) => project.id !== request.params.id);

  if (nextProjects.length === projects.length) {
    return response.status(404).json({ error: "Project not found." });
  }

  await saveProjects(nextProjects);
  return response.status(204).send();
});

app.post("/api/contact", (request: Request<unknown, unknown, ContactBody>, response: Response) => {
  const { name, email, message } = request.body;

  if (!name?.trim() || !email?.trim() || !message?.trim()) {
    return response.status(400).json({
      error: "Name, email, and message are required."
    });
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    return response.status(400).json({
      error: "Please provide a valid email address."
    });
  }

  console.log("New portfolio message", {
    name: name.trim(),
    email: email.trim(),
    message: message.trim(),
    receivedAt: new Date().toISOString()
  });

  return response.status(202).json({
    message: "Message received. Thank you for reaching out."
  });
});

app.listen(port, () => {
  console.log(`Portfolio API running on http://localhost:${port}`);
});
