import { NextResponse } from "next/server";
import { readCertificates, saveCertificates, validateCertificate } from "../../../../lib/certificate-data";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PUT(request: Request, context: RouteContext) {
  const { id } = await context.params;
  const certificate = validateCertificate({ ...(await request.json()), id });

  if (!certificate) {
    return NextResponse.json(
      { error: "Certificate title and issuer are required." },
      { status: 400 }
    );
  }

  const certificates = await readCertificates();
  const existingIndex = certificates.findIndex((item) => item.id === id);

  if (existingIndex === -1) {
    return NextResponse.json({ error: "Certificate not found." }, { status: 404 });
  }

  const nextCertificates = [...certificates];
  nextCertificates[existingIndex] = certificate;

  await saveCertificates(nextCertificates);
  return NextResponse.json(certificate);
}

export async function DELETE(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  const certificates = await readCertificates();
  const nextCertificates = certificates.filter((certificate) => certificate.id !== id);

  if (nextCertificates.length === certificates.length) {
    return NextResponse.json({ error: "Certificate not found." }, { status: 404 });
  }

  await saveCertificates(nextCertificates);
  return new Response(null, { status: 204 });
}
