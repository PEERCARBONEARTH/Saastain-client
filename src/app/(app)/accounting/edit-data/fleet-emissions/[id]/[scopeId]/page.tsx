import { Metadata } from "next";
import EditFleetEmissionsData from "./EditFleetEmissionsData";

export const metadata: Metadata = {
	title: "Edit Fleet Emissions",
};

export default function page({ params }: { params: { id: string; scopeId: string } }) {
	return <EditFleetEmissionsData {...params} />;
}
