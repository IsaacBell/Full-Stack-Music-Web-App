import { recommend } from "@/libs/gorseClient";
import { NextRequest, NextResponse } from "next/server";

/**
* @swagger
*   /api/ml/embeddings/[id]:
*       post:
*         summary: Inserts a machine learning embedding
*         description: Inserts either a user embedding, item embedding, or feedback into the recommendation system.
*         requestBody:
*           required: true
*           content:
*             application/json:
*               schema:
*                 type: object
*                 required:
*                   - type
*                   - data
*                 properties:
*                   type:
*                     type: string
*                     enum: [user, item, feedback]
*                   data:
*                     oneOf:
*                       - $ref: '#/components/schemas/User'
*                       - $ref: '#/components/schemas/Item'
*                       - $ref: '#/components/schemas/Feedback'
*         responses:
*           '200':
*             description: Successful insertion of the embedding
*             content:
*               application/json:
*                 schema:
*                   type: object
*                   properties:
*                     result:
*                       type: string
*           '400':
*             description: Invalid request
*             content:
*               application/json:
*                 schema:
*                   type: object
*                   properties:
*                     error:
*                       type: string
*/

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
