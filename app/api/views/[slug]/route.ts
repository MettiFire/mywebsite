import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// GET → restituisce le views
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  if (!slug) {
    return NextResponse.json({ error: "Missing slug" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("views")
    .select("count")
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    slug,
    views: data?.count ?? 0,
  });
}

// POST → incrementa il contatore
export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  if (!slug) {
    return NextResponse.json({ error: "Missing slug" }, { status: 400 });
  }

  // Incrementa il contatore con upsert
  const { data, error } = await supabase
    .from("views")
    .upsert(
      { slug, count: 1 },
      { onConflict: "slug", ignoreDuplicates: false }
    )
    .select("count")
    .maybeSingle();

  if (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  let newCount = data?.count ?? 1;

  if (data) {
    const { data: updated, error: updateError } = await supabase
      .from("views")
      .update({ count: newCount + 1 })
      .eq("slug", slug)
      .select("count")
      .single();

    if (updateError) {
      console.error(updateError);
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    newCount = updated.count;
  }

  return NextResponse.json({
    slug,
    views: newCount,
  });
}
