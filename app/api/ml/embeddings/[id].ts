import { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";

export async function GET(req: NextApiRequest) {
  const embeddings = null;

  if (!embeddings) {
    return NextResponse.json({ embeddings: [] }, { status: 200 });;
  }

  return NextResponse.json({ embeddings }, { status: 200 });
}
