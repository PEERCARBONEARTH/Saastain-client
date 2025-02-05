import { Metadata } from "next";
import OngoingProjectDetails from "./OngoingProjectDetails";

export const metadata: Metadata = {
	title: "Project Details",
};

export default async function Page(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    return <OngoingProjectDetails {...params} />;
}
