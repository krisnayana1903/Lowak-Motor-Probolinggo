import { NextRequest, NextResponse } from "next/server";
import { getModelsByMake } from "@/lib/queries";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const makeId = searchParams.get("make_id");

  if (!makeId) {
    return NextResponse.json([]);
  }

  const models = await getModelsByMake(Number(makeId));
  return NextResponse.json(models);
}
