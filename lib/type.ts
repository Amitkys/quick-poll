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
