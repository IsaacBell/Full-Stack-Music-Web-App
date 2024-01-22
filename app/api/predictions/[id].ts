import { NextApiRequest, NextApiResponse } from "next";
import Replicate, { Prediction } from "replicate";
import { defaultPrediction } from "./(utils)";
import { NextResponse } from "next/server";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export async function GET(req: NextApiRequest) {
  let prediction = defaultPrediction;

  const input = req.query.next;
  if (input && !Array.isArray(input)) {
    prediction = await replicate.predictions.get(input);
  }

  if (prediction?.error) {
    return NextResponse.json({ error: prediction }, { status: 500 });
  }

  return NextResponse.json({ prediction }, { status: 200 });
}
