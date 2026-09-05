import { NextRequest, NextResponse } from "next/server";
import { readStorageImage } from "@/lib/upload";

export const dynamic = "force-dynamic";

type Ctx = {
  params: Promise<{ key: string[] }>;
};

export async function GET(req: NextRequest, ctx: Ctx) {
  const { key } = await ctx.params;
  const fileKey = Array.isArray(key) ? key.join("/") : String(key);

  const image = await readStorageImage(fileKey);
  if (!image) return new NextResponse("Not found", { status: 404 });

  return new NextResponse(new Uint8Array(image.bytes), {
    status: 200,
    headers: {
      "Content-Type": image.contentType,
      "Cache-Control": "public, max-age=31536000, immutable",
      "Content-Length": String(image.bytes.length),
    },
  });
}