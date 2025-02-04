import Link from "next/link";
export default function Home() {
  return (
    <div>
      <Link className="text-green-600" href={"/create"}>
        Create Poll
      </Link>
    </div>
  );
}
