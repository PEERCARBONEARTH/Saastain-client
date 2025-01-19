import { Metadata } from "next";
import ProjectDetails from "./ProjectDetails";

export const metadata: Metadata = {
	title: "Project Details",
};

export default async function Page(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    return <ProjectDetails id={params.id} />;
}
