import { NextRequest, NextResponse } from "next/server";

import prisma from "@/lib/db";

export async function GET(request: NextRequest, context: any) {
  const { id } = await context.params;

  try {
    const poll = await prisma.poll.findUnique({
      where: {
        id,
      },
      include: {
        votes: true,
      },
    });

    return NextResponse.json({ error: false, message: "Success", poll });
  } catch (error: any) {
    // eslint-disable-next-line no-console
    console.log(error.message);

    return NextResponse.json({ error: true, message: "Failed to get poll" });
  }
}
