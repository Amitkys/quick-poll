"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import Link from "next/link"

interface PollOption {
  id: string
  text: string
}

interface PollProps {
  id: string
  title: string
  options: PollOption[]
  onVote: (pollId: string, optionId: string) => Promise<void>
}

export default function PollVoting({ id, title, options, onVote }: PollProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [isVoted, setIsVoted] = useState(false)

  const handleVote = async () => {
    if (selectedOption) {
      try {
        await onVote(id, selectedOption)
        setIsVoted(true)
      } catch (error) {
        console.error("Error submitting vote:", error)
        // You might want to show an error message to the user here
      }
    }
  }

  if (isVoted) {
    return (
      <div className="text-center space-y-4">
        <p className="text-lg font-medium">Response saved successfully</p>
        <Link href={`/poll-results/${id}`} className="text-blue-600 hover:underline">
          Check results
        </Link>
      </div>
    )
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <RadioGroup value={selectedOption || ""} onValueChange={setSelectedOption}>
          {options.map((option) => (
            <div key={option.id} className="flex items-center space-x-2">
              <RadioGroupItem value={option.id} id={option.id} />
              <Label htmlFor={option.id}>{option.text}</Label>
            </div>
          ))}
        </RadioGroup>
        <Button onClick={handleVote} disabled={!selectedOption} className="w-full">
          Vote
        </Button>
      </CardContent>
    </Card>
  )
}

