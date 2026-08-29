import { NextResponse } from "next/server";
import { getMakes } from "@/lib/queries";

export async function GET() {
  const makes = await getMakes();
  return NextResponse.json(makes);
}
