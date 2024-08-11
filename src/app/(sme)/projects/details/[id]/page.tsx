import { Metadata } from "next";
import ProjectDetails from "./ProjectDetails";

export const metadata: Metadata = {
	title: "Project Details",
};

export default function Page({ params }: { params: { id: string } }) {
	return <ProjectDetails id={params.id} />;
}
