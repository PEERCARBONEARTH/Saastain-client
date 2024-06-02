import { Metadata } from "next";
import EditProcessingEmissionsData from "./EditProcessingEmissionsData";

export const metadata: Metadata = {
	title: "Edit Processing Emissions",
};

export default function page({ params }: { params: { id: string; scopeId: string } }) {
	return <EditProcessingEmissionsData {...params} />
}
