"use server";
import prisma from "@/lib/db";
import { CreatePollData } from "@/lib/type";
import { revalidatePath } from "next/cache";
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
      shareLink: `${process.env.NEXTAUTH_URL}/poll/${poll.id}`,
    };
  } catch (error: any) {
    return {
      error: true,
      message: `something went wrong while creating poll, ${error.message}`,
    };
  }
}

export async function getPollData(pollId: string) {
  // Fetch the poll by its ID and include the creator (user) information and votes
  const poll = await prisma.poll.findUnique({
    where: { id: pollId },
    select: {
      id: true,
      title: true, // Poll title
      options: true, // Poll options
      votes: {
        // Include the votes related to the poll
        select: {
          options: true, // Vote option
          userId: true, // User ID who voted
        },
      },
    },
  });

  if (!poll) {
    throw new Error("Poll not found");
  }

  // Count the number of votes for each option
  const voteCounts = poll.options.map((option) => {
    const count = poll.votes.filter((vote) => vote.options === option).length;

    return { option, count };
  });

  // Calculate the total number of votes
  const totalVotes = poll.votes.length;

  // Calculate the percentage of votes for each option
  const votePercentages = voteCounts.map(({ option, count }) => ({
    option,
    count,
    percentage:
      totalVotes > 0 ? ((count / totalVotes) * 100).toFixed(2) : "0.00", // Prevent division by zero
  }));

  // Return the poll data along with vote counts, percentages, and userIds
  return {
    pollId: poll.id,
    title: poll.title,
    options: votePercentages, // Each option with count and percentage
    totalVotes, // Total number of votes
    usersWhoVoted: poll.votes.map((vote) => vote.userId), // Return user IDs who voted
  };
}


export async function setVote(option: string, userId: string, pollId: string) {
  console.log("from backend", option, userId, pollId)
  try {
    // Create a new vote entry
    await prisma.vote.create({
      data: {
        poll_id: pollId,
        userId: userId,
        options: option,
      },
    });
  } catch (error) {
    console.error("Error casting vote:", error);
    throw new Error("Failed to cast vote");
  }
  revalidatePath(`/poll/${pollId}`)
}
