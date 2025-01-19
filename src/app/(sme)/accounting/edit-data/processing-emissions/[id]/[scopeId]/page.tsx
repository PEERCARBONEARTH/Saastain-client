import { Metadata } from "next";
import EditProcessingEmissionsData from "./EditProcessingEmissionsData";

export const metadata: Metadata = {
	title: "Edit Processing Emissions",
};

export default async function page(props: { params: Promise<{ id: string; scopeId: string }> }) {
    const params = await props.params;
    return <EditProcessingEmissionsData {...params} />
}
