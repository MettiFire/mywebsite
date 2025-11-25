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
    views: data?.count ?? 1,
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

  // Prima verifica se il record esiste
  const { data: existing } = await supabase
    .from("views")
    .select("count")
    .eq("slug", slug)
    .maybeSingle();

  let newCount: number;

  if (existing) {
    // Se esiste, incrementa
    const { data: updated, error: updateError } = await supabase
      .from("views")
      .update({ count: existing.count + 1 })
      .eq("slug", slug)
      .select("count")
      .single();

    if (updateError) {
      console.error(updateError);
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    newCount = updated.count;
  } else {
    // Se non esiste, crea con count = 1
    const { data: inserted, error: insertError } = await supabase
      .from("views")
      .insert({ slug, count: 1 })
      .select("count")
      .single();

    if (insertError) {
      console.error(insertError);
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    newCount = inserted.count;
  }

  return NextResponse.json({
    slug,
    views: newCount,
  });
}
