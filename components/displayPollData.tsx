"use client";

import type { PollData } from "@/lib/type";

import { signIn, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";
import { Alert } from "@heroui/alert";

import { setVote } from "@/lib/actions/actions";
import { Button } from "@/components/ui/button";

export default function PollCard({ pollData }: { pollData: PollData }) {
  const [sessionUserId, setSessionUserId] = useState<string | undefined | null>(
    null,
  );
  const [voted, setVoted] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const { data: session, status } = useSession();

  const currentUrl = window.location.pathname;

  useEffect(() => {
    if (session?.user) {
      setSessionUserId(session.user.id);

      // If user has already voted, find their selected option
      if (pollData.usersWhoVoted.includes(session.user.id)) {
        setVoted(true);
        // You might want to store the user's selected option in your database
        // and retrieve it here to highlight their choice
      } else {
        setVoted(false);
      }
    }
  }, [session, pollData.usersWhoVoted]);

  const handleVote = async (option: string) => {
    if (sessionUserId && pollData.pollId && !voted) {
      try {
        await setVote(option, sessionUserId, pollData.pollId);
        setVoted(true);
        toast.success("Sumitted successfully 😊");
        setSelectedOption(option);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error("Error casting vote:", error);
      }
    }
  };

  if (status === "loading") {
    return (
      <div className="max-w-md mx-auto bg-card rounded-xl shadow-md p-6">
        <div className="animate-pulse space-y-3">
          <div className="h-6 bg-muted rounded w-3/4" />
          <div className="space-y-2">
            {[1, 2].map((i) => (
              <div key={i} className="h-14 bg-muted rounded" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {!session ? (
        <Alert
          className="mt-[-60px] mb-4"
          color="warning"
          description="Indentify who you are"
          endContent={
            <Button
              color="warning"
              size="sm"
              onClick={() => signIn("google", { callbackUrl: currentUrl })}
            >
              SignIn
            </Button>
          }
          title="Please SignIn"
          variant="faded"
        />
      ) : null}
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md mx-auto bg-card rounded-xl shadow-md overflow-hidden border"
        initial={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.5 }}
      >
        <div className="p-6">
          <h2 className="text-lg font-semibold text-card-foreground mb-4">
            {pollData.title}
          </h2>
          <div className="space-y-2">
            {pollData.options.map((option, index) => {
              const isSelected = voted && option.option === selectedOption;
              const percentage = Number.parseFloat(option.percentage).toFixed(
                0,
              );

              return (
                <motion.button
                  key={index}
                  className={`
    w-full text-left p-4 rounded-lg transition-all
    ${!session || voted ? "bg-muted cursor-not-allowed" : "bg-muted/50 hover:bg-muted"}
    relative group
  `}
                  disabled={!session || voted} // Disable if no session or if already voted
                  whileHover={!voted ? { scale: 1.01 } : {}}
                  whileTap={!voted ? { scale: 0.99 } : {}}
                  onClick={() => handleVote(option.option)}
                >
                  <div className="relative z-10 flex justify-between items-center">
                    <span
                      className={`font-medium ${isSelected ? "text-primary" : ""}`}
                    >
                      {option.option}
                    </span>
                    {voted && (
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">
                          {option.count} {option.count === 1 ? "vote" : "votes"}{" "}
                          ({percentage}%)
                        </span>
                        {isSelected && (
                          <CheckCircle2 className="text-primary" size={16} />
                        )}
                      </div>
                    )}
                  </div>
                  {voted && (
                    <motion.div
                      animate={{ width: `${percentage}%` }}
                      className={`
												absolute left-0 top-0 h-full rounded-lg
												${isSelected ? "bg-primary/20" : "bg-muted/50"}
											`}
                      initial={{ width: 0 }}
                      style={{ zIndex: 0 }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                    />
                  )}
                </motion.button>
              );
            })}
          </div>
          <div className="mt-4 flex justify-between items-center text-sm text-muted-foreground">
            <span>
              {pollData.totalVotes}{" "}
              {pollData.totalVotes === 1 ? "vote" : "votes"} total
            </span>
            {!voted && sessionUserId && (
              <span className="text-primary font-medium">Click to vote</span>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
