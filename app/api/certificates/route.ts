import { NextResponse } from "next/server";
import { readCertificates, saveCertificates, validateCertificate } from "../../../lib/certificate-data";

export const dynamic = "force-dynamic";

export async function GET() {
  const certificates = await readCertificates();
  return NextResponse.json(certificates, {
    headers: { "Cache-Control": "no-store" }
  });
}

export async function POST(request: Request) {
  const certificate = validateCertificate(await request.json());

  if (!certificate) {
    return NextResponse.json(
      { error: "Certificate title and issuer are required." },
      { status: 400 }
    );
  }

  const certificates = await readCertificates();
  const uniqueId = certificates.some((item) => item.id === certificate.id)
    ? `${certificate.id}-${Date.now()}`
    : certificate.id;
  const nextCertificate = { ...certificate, id: uniqueId };

  await saveCertificates([nextCertificate, ...certificates]);
  return NextResponse.json(nextCertificate, { status: 201 });
}
