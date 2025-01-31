import { NextRequest, NextResponse } from "next/server";

import prisma from "@/lib/db";

export async function GET(request: NextRequest, context: any) {
  const { id } = await context.params;

  if (!id) return NextResponse.json({ error: true, message: "Invalid id" });

  try {
    const poll = await prisma.poll.findUnique({
      where: {
        id,
      },
      include: {
        votes: true,
      },
    });

    if (!poll) {
      return NextResponse.json({ error: true, message: "Result not found" });
    }

    const votesPerOption: Record<string, number> = {};

    poll.options.forEach((option) => {
      votesPerOption[option] = 0;
    });

    poll.votes.forEach((vote) => {
      if (votesPerOption[vote.options] != undefined)
        votesPerOption[vote.options]++;
    });

    return NextResponse.json({
      id: poll.id,
      question: poll.question,
      options: poll.options,
      totalVotes: poll.votes.length,
      votesPerOption,
      expiresAt: poll.expires_at,
      createdAt: poll.created_at,
    });
  } catch (error: any) {
    // eslint-disable-next-line no-console
    console.log(error.message);

    return NextResponse.json({ error: true, message: "Failed to get poll" });
  }
}
