import { getPollData } from "@/lib/actions/actions";
import { PollData } from "@/lib/type";
import PollCard from "@/components/displayPollData";

// Define the type for the component's props
type Params = Promise<{ id: string }>

export default async function Page(props: { params: Params }) {
  const params = await props.params;
  const id = params.id;

  // Fetch poll data using the id
  const pollData: PollData = await getPollData(id);

  // Render the PollCard with the fetched data
  return <PollCard pollData={pollData} />;
}