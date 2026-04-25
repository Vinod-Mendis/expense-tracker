import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";
import { uploadImage } from "@/lib/r2";

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const file = form.get("file") as File | null;
    const folder = (form.get("folder") as string | null) ?? "general";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "Only image files are supported" },
        { status: 400 },
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const webpBuffer = await sharp(buffer).webp({ quality: 85 }).toBuffer();

    const baseName = file.name.replace(/\.[^/.]+$/, "");
    const url = await uploadImage(webpBuffer, folder, baseName);

    return NextResponse.json({ url, name: `${baseName}.webp` });
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
