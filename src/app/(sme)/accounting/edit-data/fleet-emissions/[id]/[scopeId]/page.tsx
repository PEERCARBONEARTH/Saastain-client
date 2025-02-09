import { Metadata } from "next";
import EditFleetEmissionsData from "./EditFleetEmissionsData";

export const metadata: Metadata = {
	title: "Edit Fleet Emissions",
};

export default async function page(props: { params: Promise<{ id: string; scopeId: string }> }) {
    const params = await props.params;
    return <EditFleetEmissionsData {...params} />;
}
