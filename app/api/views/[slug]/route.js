import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "app/api/views/views.json");

function loadViews() {
  if (!fs.existsSync(filePath)) return {};
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function saveViews(data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

// GET → restituisce il numero di views
export async function GET(request, { params }) {
  const { slug } = await params;
  const views = loadViews();

  return NextResponse.json({
    slug,
    views: views[slug] ?? 0,
  });
}

// POST → incrementa il contatore
export async function POST(request, { params }) {
  const { slug } = await params;
  const views = loadViews();

  views[slug] = (views[slug] ?? 0) + 1;
  saveViews(views);

  return NextResponse.json({
    slug,
    views: views[slug],
  });
}
