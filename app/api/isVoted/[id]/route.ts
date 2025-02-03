import { NextRequest, NextResponse } from "next/server";

import prisma from "@/lib/db";
import { getDeviceId } from "@/lib/device";

export async function GET(req: NextRequest, context: any) {
  const { id } = await context.params;

  const deviceId = getDeviceId(req);

  try {
    const data = await prisma.vote.findFirst({
      where: { poll_id: id, deviceId },
    });

    if (data?.deviceId) {
      return NextResponse.json({ error: false, isVoted: true });
    } else {
      return NextResponse.json({ error: true, isVoted: false });
    }
  } catch (error: any) {
    // eslint-disable-next-line no-console
    console.error("Error while checking isvoted or not", error.message);

    return NextResponse.json({
      error: true,
      message: "could not find voted or not",
    });
  }
}
