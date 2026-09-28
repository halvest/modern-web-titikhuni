import { verifyAdmin } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Akses ditolak.";
}

function normalizeSlug(value: string) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function readCategoryRequest(request: Request) {
  const body = (await request.json()) as { id?: unknown; name?: unknown };
  const id = typeof body.id === "string" ? body.id : "";
  const name = typeof body.name === "string" ? body.name.trim() : "";
  return { id, name, slug: normalizeSlug(name) };
}

export async function POST(request: Request) {
  let supabase;
  try {
    supabase = await verifyAdmin();
  } catch (error: unknown) {
    return NextResponse.json({ error: errorMessage(error) }, { status: 401 });
  }

  let category;
  try {
    category = await readCategoryRequest(request);
  } catch {
    return NextResponse.json({ error: "Format permintaan tidak valid." }, { status: 400 });
  }
  const { name, slug } = category;

  if (!name || !slug) {
    return NextResponse.json({ error: "Nama kategori wajib diisi." }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("categories")
    .insert([{ name, slug }])
    .select("id, name, slug")
    .single();

  if (error) {
    if (error.code === "23505") {
      return NextResponse.json({ error: "Slug kategori ini sudah ada, gunakan yang lain." }, { status: 400 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data, { status: 201 });
}

export async function PATCH(request: Request) {
  let supabase;
  try {
    supabase = await verifyAdmin();
  } catch (error: unknown) {
    return NextResponse.json({ error: errorMessage(error) }, { status: 401 });
  }

  let category;
  try {
    category = await readCategoryRequest(request);
  } catch {
    return NextResponse.json({ error: "Format permintaan tidak valid." }, { status: 400 });
  }
  const { id, name, slug } = category;

  if (!id || !name || !slug) {
    return NextResponse.json({ error: "Data kategori tidak lengkap." }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("categories")
    .update({ name, slug })
    .eq("id", id)
    .select("id, name, slug")
    .single();

  if (error) {
    if (error.code === "23505") {
      return NextResponse.json({ error: "Slug kategori ini sudah ada, gunakan yang lain." }, { status: 400 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data);
}

export async function DELETE(request: Request) {
  let supabase;
  try {
    supabase = await verifyAdmin();
  } catch (error: unknown) {
    return NextResponse.json({ error: errorMessage(error) }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Kategori tidak ditemukan." }, { status: 400 });
  }

  const [units, posts] = await Promise.all([
    supabase.from("units").select("id", { count: "exact", head: true }).eq("category_id", id),
    supabase.from("posts").select("id", { count: "exact", head: true }).eq("category_id", id),
  ]);

  if (units.error || posts.error) {
    return NextResponse.json({ error: "Relasi kategori gagal diperiksa." }, { status: 500 });
  }

  const references = (units.count || 0) + (posts.count || 0);
  if (references > 0) {
    return NextResponse.json(
      { error: `Kategori masih digunakan oleh ${references} unit atau artikel.` },
      { status: 409 }
    );
  }

  const { data, error } = await supabase
    .from("categories")
    .delete()
    .eq("id", id)
    .select("id")
    .maybeSingle();

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  if (!data)
    return NextResponse.json({ error: "Kategori tidak ditemukan." }, { status: 404 });
  return NextResponse.json({ success: true });
}
