import { NextRequest, NextResponse } from "next/server";

const BASE_URL = process.env.BACKEND_API_URL || "http://localhost:8000";

export async function PUT(req: NextRequest, ctx: { params?: { id?: string } }) {
  const urlObj = new URL(req.url);
  const pathParts = urlObj.pathname.split("/").filter(Boolean);
  const fallbackId = pathParts[pathParts.length - 1];
  const rawId = ctx?.params?.id ?? fallbackId;
  const idNum = Number(rawId);
  if (!rawId || Number.isNaN(idNum) || idNum <= 0) {
    return new Response(
      JSON.stringify({
        response_code: 400,
        response_status: "failed-validation",
        message: "Invalid employee id",
        errors: [`Invalid id: ${rawId}`],
      }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const target = `${BASE_URL}/api/employees/${idNum}`;
  const json = await req.json();
  const res = await fetch(target, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(json),
  });
  const body = await res.json();
  return NextResponse.json(body, { status: res.status });
}
