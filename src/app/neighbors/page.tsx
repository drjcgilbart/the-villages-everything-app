import { redirect } from "next/navigation";

/** Meet Your Neighbors now lives on each village page under The Villages. */
export default function NeighborsRedirectPage() {
  redirect("/my-village");
}
