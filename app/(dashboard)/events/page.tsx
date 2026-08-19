import { Metadata } from "next";
import { EventTable } from "@/features/events/components/event-table";

export const metadata: Metadata = {
  title: "Event Management | Real Success Admin",
  description: "Real Success Event Management Table",
};

export default function EventsPage() {
  return <EventTable />;
}
