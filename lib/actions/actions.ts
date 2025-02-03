"use server";
import prisma from "@/lib/db";
import { CreatePollData } from "@/lib/type";
export async function CreatePoll(data: CreatePollData) {
  const { title, options, timerInMinutes, userId } = data;

  const expiresAt = new Date();

  expiresAt.setMinutes(expiresAt.getMinutes() + timerInMinutes); // Add duration to current time

  try {
    const poll = await prisma.poll.create({
      data: {
        title,
        options,
        expires_at: expiresAt,
        creatorId: userId,
      },
    });
    console.log("poll created");

    return {
      error: false,
      shareLink: `${process.env.NEXT_PUBLIC_BASE_URL}/poll/${poll.id}`,
    };
  } catch (error: any) {
    return {
      error: true,
      message: `something went wrong while creating poll, ${error.message}`,
    };
  }
}
