import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

export type CertificateBody = {
  id?: string;
  title?: string;
  issuer?: string;
  issuedAt?: string;
  category?: string;
  imageUrl?: string;
  fileUrl?: string;
};

export type Certificate = {
  id: string;
  title: string;
  issuer: string;
  issuedAt: string;
  category: string;
  imageUrl: string;
  fileUrl: string;
};

const dataDirectory = path.join(process.cwd(), "data");
const certificatesFile = path.join(dataDirectory, "certificates.json");

const starterCertificates: Certificate[] = [
  {
    id: "certificate-of-completion",
    title: "Certificate of Completion",
    issuer: "Learning Achievement",
    issuedAt: "2026",
    category: "Achievement",
    imageUrl: "",
    fileUrl: "/certificate.pdf"
  }
];

function createSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function readCertificates() {
  try {
    const content = await readFile(certificatesFile, "utf-8");
    return JSON.parse(content) as Certificate[];
  } catch {
    await mkdir(dataDirectory, { recursive: true });
    await writeFile(certificatesFile, JSON.stringify(starterCertificates, null, 2));
    return starterCertificates;
  }
}

export async function saveCertificates(certificates: Certificate[]) {
  await mkdir(dataDirectory, { recursive: true });
  await writeFile(certificatesFile, JSON.stringify(certificates, null, 2));
}

export function validateCertificate(body: CertificateBody) {
  const title = body.title?.trim();
  const issuer = body.issuer?.trim();

  if (!title || !issuer) {
    return null;
  }

  return {
    id: body.id?.trim() || createSlug(title),
    title,
    issuer,
    issuedAt: body.issuedAt?.trim() || "Recent",
    category: body.category?.trim() || "Certificate",
    imageUrl: body.imageUrl?.trim() || "",
    fileUrl: body.fileUrl?.trim() || "#"
  } satisfies Certificate;
}
