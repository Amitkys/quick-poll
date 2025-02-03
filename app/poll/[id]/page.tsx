"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "next/navigation";
import useSWR from "swr";
import toast from "react-hot-toast";
import Countdown from "react-countdown";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { PollResponse } from "@/lib/type";

// SWR fetcher for GET requests
const fetcher = async (url: string): Promise<PollResponse> => {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("failed to fetch poll data");
    }

    return response.json();
  } catch (error: any) {
    // eslint-disable-next-line no-console
    console.error("Error fetching poll data:", error.message);
    toast.error("Something went wrong");

    throw new Error("Failed to fetch poll data");
  }
};


export default function PollVoting() {
  const { id } = useParams() as { id: string };
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [expiryTime, setExpiryTime] = useState<number | null>(null);
  
  const checkIsVoted = async () => {
    const res = axios.get(`/api/isVoted/${id}`);
    console.log(res);
  }



  // SWR for fetching poll data with disabled automatic revalidation
  const {
    data: pollData,
    error: fetchError,
    isLoading,
  } = useSWR<PollResponse>(`/api/getPoll/${id}`, fetcher, {
    // revalidateOnFocus: false,
    // revalidateOnReconnect: false
  });

  // Set expiry time once when poll data is loaded
  useEffect(() => {
    if (pollData?.poll) {
      const expiresAt = new Date(pollData.poll.expires_at).getTime();

      setExpiryTime(expiresAt);
    }
  }, [pollData]);
  useEffect(() => {
    checkIsVoted();
  }, []);

  // Handle vote submission using Axios
  const handleVote = async () => {
    if (!selectedOption) {
      toast.error("Please select an option to vote.");

      return;
    }

    try {
      const response = await axios.post("/api/vote", {
        poll_id: id,
        option: selectedOption,
      });

      if (response.data.error) {
        throw new Error(response.data.message);
      }

      toast.success("Vote submitted successfully!");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to submit vote",
      );
    }
  };



  // Loading state
  if (isLoading) return <div className="text-center">Loading poll...</div>;

  // Error states
  if (fetchError || pollData?.error) {
    toast.error(
      fetchError?.message || pollData?.message || "Failed to load poll",
    );

    return <div className="text-center text-red-500">Failed to load poll.</div>;
  }

  if (!pollData?.poll)
    return <div className="text-center text-red-500">Poll not found.</div>;

  if (expiryTime && Date.now() > expiryTime)
    return (
      <div className="text-center text-red-500 text-lg font-medium">
        Sorry, this poll is expired.
      </div>
    );
  if (pollData.poll.votes.find((vote) => vote.deviceId == deviceId))
    return (
      <div className="text-center text-red-500 text-lg font-medium">
        You have already voted.
      </div>
    );

  // Render poll UI
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>{pollData.poll.question}</CardTitle>
        {expiryTime && (
          <p className="text-sm text-gray-500">
            <Countdown
              date={expiryTime}
              renderer={({ minutes, seconds }) => (
                <span>
                  Expires in: {minutes}m {seconds}s
                </span>
              )}
            />
          </p>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        <RadioGroup
          value={selectedOption || ""}
          onValueChange={setSelectedOption}
        >
          {pollData.poll.options.map((option, index) => (
            <div key={index} className="flex items-center space-x-2">
              <RadioGroupItem id={`option-${index}`} value={option} />
              <Label htmlFor={`option-${index}`}>{option}</Label>
            </div>
          ))}
        </RadioGroup>

        <Button
          className="w-full"
          disabled={!selectedOption}
          onClick={handleVote}
        >
          Vote
        </Button>
      </CardContent>
    </Card>
  );
}
