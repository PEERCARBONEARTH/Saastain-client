import { Metadata } from "next";
import OngoingProjectDetails from "./OngoingProjectDetails";

export const metadata: Metadata = {
	title: "Project Details",
};

export default function Page({ params }: { params: { id: string } }) {
	return <OngoingProjectDetails {...params} />;
}
