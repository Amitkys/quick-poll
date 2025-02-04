"use client";

import { useState } from "react";
import { Plus, Minus, Send } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { Snippet } from "@heroui/snippet";
import { signIn, useSession } from "next-auth/react";
import { Loader2 } from "lucide-react";
import { Alert } from "@heroui/alert";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { CreatePoll } from "@/lib/actions/actions";

export default function PollCreation() {
  const [title, setTitle] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [isPollCreated, setIsPollCreated] = useState(false);
  const [timer, setTimer] = useState("1 minute");
  const [isPending, setIsPending] = useState(false);
  const [link, setLink] = useState(null);
  const { data: session, status } = useSession();

  // Mapping durations to minutes :)
  const durationMap: Record<string, number> = {
    "1 minute": 1,
    "2 minutes": 2,
    "3 minutes": 3,
    "5 minutes": 5,
    "10 minutes": 10,
    "30 minutes": 30,
    "1 hour": 60,
    "12 hours": 12 * 60,
    "1 day": 24 * 60,
  };
  // shortenURL api
  const shortenURL = async (originalURL: any) => {
    if (!originalURL) {
      toast.error("URL is required");

      return;
    }
    const response = await axios.get(
      `https://tinyurl.com/api-create.php?url=${encodeURIComponent(originalURL)}`,
    );

    setLink(response.data); // Store the short link :)
  };

  const handleDurationChange = (value: string) => {
    setTimer(value); // Keep the string value for Select
  };

  const addOption = () => {
    setOptions([...options, ""]);
  };

  const removeOption = (index: number) => {
    if (options.length > 2) {
      const newOptions = options.filter((_, i) => i !== index);

      setOptions(newOptions);
    }
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];

    newOptions[index] = value;
    setOptions(newOptions);
  };

  if (status == "loading") {
    return <div>please wait</div>;
  }
  if (status == "authenticated") {
    var userId = session?.user.id;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const timerInMinutes = durationMap[timer]; // Convert before submission

    setIsPending(true);
    setLink(null);

    await toast.promise(
      (async () => {
        const data = { title, options, timerInMinutes, userId };
        const res = await CreatePoll(data);

        if (!res.error) {
          setIsPollCreated(true);
          shortenURL(res?.shareLink);
        } else {
          toast.error("Poll not created, try after some time");
        }
      })(),
      {
        loading: "Creating poll...",
        success: "Poll created successfully!",
        error: "Failed to create poll. Try again!",
      },
    );

    setIsPending(false);
  };

  return (
    <div>
      {!session ? (
        // have alert
        <Alert
          className="mt-[-60px] mb-4"
          color="warning"
          description="Indentify who you are"
          endContent={
            <Button
              color="warning"
              size="sm"
              onClick={() => signIn("google", { callbackUrl: "/create" })}
            >
              SignIn
            </Button>
          }
          title="Please SignIn"
          variant="faded"
        />
      ) : null}

      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Create a Poll</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium" htmlFor="title">
                Poll Title
              </Label>
              <Input
                required
                id="title"
                placeholder="Enter poll title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Poll Duration</Label>
              <Select value={timer} onValueChange={handleDurationChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(durationMap).map((key) => (
                    <SelectItem key={key} value={key}>
                      {key}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Poll Options</Label>
              {options.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Input
                    required
                    placeholder={`Option ${index + 1}`}
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                  />
                  {index >= 2 && (
                    <Button
                      size="icon"
                      type="button"
                      variant="outline"
                      onClick={() => removeOption(index)}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button
                className="w-full"
                type="button"
                variant="outline"
                onClick={addOption}
              >
                <Plus className="h-4 w-4 mr-2" /> Add Option
              </Button>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col">
            <Button
              className="w-full"
              disabled={!session || isPending}
              type="submit"
            >
              <Send className="h-4 w-4 mr-2" /> Create Poll
            </Button>
            {isPollCreated && (
              <div className="mt-3 text-sm text-green-500 text-left flex items-center space-x-2">
                <span>Share this link to get vote</span>
                {!link && <Loader2 className="w-4 h-4 animate-spin" />}
              </div>
            )}

            {link && (
              <Snippet className="mt-1 " color="success" size="sm" symbol="🔗">
                {link}
              </Snippet>
            )}
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
