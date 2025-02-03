import { NextResponse } from "next/server";

import { getDeviceId } from "@/lib/device";

export async function GET(req: any) {
  const id = getDeviceId(req);

  return NextResponse.json({ id });
}
