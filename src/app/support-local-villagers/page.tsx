import { redirect } from "next/navigation";

/** Support Local now lives inside Local Pros with a Villager badge. */
export default function SupportLocalVillagersPage() {
  redirect("/local-pros");
}
