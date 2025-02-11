import { Metadata } from "next";
import EventsPage from "./EventsPage";

export const metadata: Metadata = {
	title: "Events",
};

const page = () => {
	return <EventsPage />
};

export default page;
