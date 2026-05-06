import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

export type Accent = "cyan" | "violet" | "blue" | "green";

export type ProjectBody = {
  id?: string;
  title?: string;
  description?: string;
  tech?: string[] | string;
  accent?: Accent;
  image?: string;
  projectUrl?: string;
  codeUrl?: string;
};

export type Project = {
  id: string;
  title: string;
  description: string;
  tech: string[];
  accent: Accent;
  image: string;
  projectUrl: string;
  codeUrl: string;
};

const dataDirectory = path.join(process.cwd(), "data");
const projectsFile = path.join(dataDirectory, "projects.json");

const starterProjects: Project[] = [
  {
    id: "tutor-match-system",
    title: "Tutor Match System",
    description:
      "A matching platform concept focused on connecting students with tutors through structured profiles, searchable skills, and reliable request flows.",
    tech: ["Node.js", "Express", "MySQL", "React"],
    accent: "cyan",
    image: "/images.png",
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
    image: "/optiflow.png",
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

export async function readProjects() {
  try {
    const content = await readFile(projectsFile, "utf-8");
    return JSON.parse(content) as Project[];
  } catch {
    await mkdir(dataDirectory, { recursive: true });
    await writeFile(projectsFile, JSON.stringify(starterProjects, null, 2));
    return starterProjects;
  }
}

export async function saveProjects(projects: Project[]) {
  await mkdir(dataDirectory, { recursive: true });
  await writeFile(projectsFile, JSON.stringify(projects, null, 2));
}

export function validateProject(body: ProjectBody) {
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
