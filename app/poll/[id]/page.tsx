"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";
import { useParams } from "next/navigation";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface PollData {
  id: string;
  question: string;
  options: string[]; // Updated to match backend structure
  expires_at: string;
}

export default function PollVoting() {
  const { id } = useParams(); // Extract poll ID from URL
  const [poll, setPoll] = useState<PollData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isVoted, setIsVoted] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number>(0);

  useEffect(() => {
    const fetchPoll = async () => {
      try {
        const res = await axios.get(`/api/getPoll/${id}`);

        setPoll(res.data.poll);

        // Set countdown timer
        const expiresAt = new Date(res.data.poll.expires_at).getTime();
        const now = Date.now();

        setTimeLeft(Math.max(0, Math.floor((expiresAt - now) / 1000)));
      } catch (err: any) {
        setError("Failed to load poll.");
      } finally {
        setLoading(false);
      }
    };

    fetchPoll();
  }, [id]);

  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleVote = async () => {
    if (selectedOption) {
      try {
        await axios.post(`/api/votePoll/${id}`, { option: selectedOption });
        setIsVoted(true);
      } catch (error) {
        console.error("Error submitting vote:", error);
      }
    }
  };

  if (loading) return <div className="text-center">Loading poll...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;
  if (!poll)
    return <div className="text-center text-red-500">Poll not found.</div>;
  if (timeLeft === 0)
    return (
      <div className="text-center text-red-500 text-lg font-medium">
        Sorry, this poll is expired.
      </div>
    );

  const formatTime = () => {
    if (timeLeft < 60) return `${timeLeft} seconds`;
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    return seconds === 0
      ? `${minutes} minutes`
      : `${minutes} min ${seconds} sec`;
  };

  if (isVoted) {
    return (
      <div className="text-center space-y-4">
        <p className="text-lg font-medium">Response saved successfully</p>
        <Link
          className="text-blue-600 hover:underline"
          href={`/poll-results/${id}`}
        >
          Check results
        </Link>
      </div>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>{poll.question}</CardTitle>
        <p className="text-sm text-gray-500">Expires in: {formatTime()}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <RadioGroup
          value={selectedOption || ""}
          onValueChange={setSelectedOption}
        >
          {poll.options.length > 0 ? (
            poll.options.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem id={`option-${index}`} value={option} />
                <Label htmlFor={`option-${index}`}>{option}</Label>
              </div>
            ))
          ) : (
            <p className="text-red-500">No options available</p>
          )}
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
