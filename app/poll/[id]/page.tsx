import { getPollData } from "@/lib/actions/actions";
import { PollData } from "@/lib/type";
import PollCard from "@/components/displayPollData";

export default async function Page({ params }: { params: { id: string } }) {
  const { id } = await params; // Access params directly
  const pollData: PollData = await getPollData(id);

  return <PollCard pollData={pollData} />;
}
