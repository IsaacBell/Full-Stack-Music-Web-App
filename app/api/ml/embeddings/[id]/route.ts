import { recommend } from "@/libs/gorseClient";
import { NextRequest, NextResponse } from "next/server";

type UserType = 'user' | 'admin';
export async function GET(req: NextRequest, res: NextResponse) {
  const path = req.url?.split('/') ?? [];

  if (path.length === 0) {
    return NextResponse.json({ embeddings: [] }, { status: 200 });;
  }

  const userId = (path[path.length - 1] ?? '') as string;
  
  const embeddings = await recommend(userId ?? 'bob');

  if (!embeddings) {
    return NextResponse.json({ embeddings: [] }, { status: 200 });;
  }

  return NextResponse.json({ embeddings }, { status: 200 });
}
