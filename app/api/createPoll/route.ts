import { NextResponse } from "next/server";

import prisma from "@/lib/db";

export async function POST(request: Request) {
  const body = await request.json();
  const { question, options, durations } = body;

  if (!question || !options || !durations) {
    return NextResponse.json({
      error: true,
      message: "Missing required fields",
    });
  }

  const expriationDate = new Date(Date.now() + durations * 60 * 1000); // duration in minute

  try {
    const poll = await prisma.poll.create({
      data: {
        question,
        options,
        expires_at: expriationDate,
      },
    });

    return NextResponse.json({
      error: false,
      message: "Poll created successfully",
      shareLink: `${process.env.NEXT_PUBLIC_BASE_URL}/poll/${poll.id}`,
    });
  } catch (error: any) {
    // eslint-disable-next-line no-console
    console.log(error.message);

    return NextResponse.json({ error: true, message: "Failed to create poll" });
  }
}
