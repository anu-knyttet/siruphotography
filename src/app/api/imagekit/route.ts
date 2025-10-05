import { NextRequest, NextResponse } from "next/server";
import ImageKit from "imagekit";

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY!,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT!,
});

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const folder = searchParams.get("folder") || "family"; // default to 'family'

  try {
    const files = await imagekit.listFiles({
      path: `/${folder}`,
      limit: 100,
    });
    return NextResponse.json(files);
  } catch (error: unknown) {
    // If it's an Error object, get the message, else fallback
    const message = error instanceof Error ? error.message : "Failed to fetch images";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
