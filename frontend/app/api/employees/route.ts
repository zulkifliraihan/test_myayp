import { NextRequest, NextResponse } from "next/server";

const BASE_URL = process.env.BACKEND_API_URL || "http://localhost:8000";

export async function GET(req: NextRequest) {
  const { search } = new URL(req.url);
  const target = `${BASE_URL}/api/employees${search || ""}`;
  const res = await fetch(target, { cache: "no-store" });
  const body = await res.json();
  return NextResponse.json(body, { status: res.status });
}
