// page.tsx
import { Metadata } from "next";
import EventPledgeProvider from "./components/EventPledgeProvider";

export const metadata: Metadata = {
  title: "Events Pledge",
};

export default function Page() {
  return <EventPledgeProvider />;
}