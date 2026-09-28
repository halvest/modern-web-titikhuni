import { verifyAdmin } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

const ALLOWED_STATUSES = new Set([
  "NEW",
  "CONTACTED",
  "QUALIFIED",
  "SITE_VISIT",
  "BOOKING",
  "WON",
  "LOST",
]);

function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Akses ditolak.";
}

export async function PATCH(request: Request) {
  let supabase;
  try {
    supabase = await verifyAdmin();
  } catch (error: unknown) {
    return NextResponse.json({ error: errorMessage(error) }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Format permintaan tidak valid." }, { status: 400 });
  }

  const payload = body as { id?: unknown; status?: unknown };
  const id = typeof payload.id === "string" ? payload.id : "";
  const status = typeof payload.status === "string" ? payload.status.toUpperCase() : "";

  if (!id || !ALLOWED_STATUSES.has(status)) {
    return NextResponse.json({ error: "ID atau status lead tidak valid." }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("leads")
    .update({ status })
    .eq("id", id)
    .select("id, status")
    .maybeSingle();

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  if (!data)
    return NextResponse.json({ error: "Lead tidak ditemukan." }, { status: 404 });
  return NextResponse.json({ success: true, lead: data });
}
