export interface Vote {
  id: string;
  poll_id: string;
  options: string;
  deviceId: string;
  created_at: string;
}

export interface Poll {
  id: string;
  question: string;
  options: string[];
  created_at: string;
  expires_at: string;
  votes: Vote[];
}

export interface PollResponse {
  error: boolean;
  message: string;
  poll: Poll;
}

export interface CreatePollData {
  title: string;
  userId: string;
  options: string[];
  timerInMinutes: number;
}

// Define the structure of each option's data
export interface OptionData {
  option: string; // The name of the poll option
  count: number; // The number of votes for the option
  percentage: string; // The percentage of votes for the option (as a string, e.g., "50.00")
}

// Define the structure for the poll data
export interface PollData {
  pollId: string; // The ID of the poll
  title: string; // The title of the poll
  options: OptionData[]; // An array of options with their vote counts and percentages
  totalVotes: number; // Total number of votes cast in the poll
  usersWhoVoted: string[]; // Array of user IDs who have voted in the poll
}

