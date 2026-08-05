import { redirect } from "next/navigation";

/** Meet Your Neighbors now lives on each village page under My Village. */
export default function NeighborsRedirectPage() {
  redirect("/my-village");
}
