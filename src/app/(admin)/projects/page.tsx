import { Metadata } from "next";
import OngoingProjects from "./OngoingProjects";

export const metadata: Metadata = {
	title: "Ongoing",
};

const page = () => {
	return <OngoingProjects />;
};

export default page;
