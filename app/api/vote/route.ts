import { NextResponse } from "next/server";

import { getDeviceId } from "@/lib/device";
import prisma from "@/lib/db";

export async function POST(request: Request) {
  const body = await request.json();
  const { poll_id, option } = body;
  const deviceId = getDeviceId(request);

  try {
    const existingVote = await prisma.vote.findFirst({
      where: { poll_id, deviceId, options: option },
    });

    if (existingVote) {
      return NextResponse.json({
        error: true,
        message: "You have already voted",
      });
    }

    await prisma.vote.create({
      data: {
        poll_id,
        deviceId,
        options: option,
      },
    });

    return NextResponse.json({
      error: false,
      message: "Vote cast successfully",
    });
  } catch (error: any) {
    // eslint-disable-next-line no-console
    console.log(error.message);

    return NextResponse.json({ error: true, message: "Failed to vote" });
  }
}
