import { Metadata } from "next";
import EditStationaryCombustionData from "./EditStationaryCombustionData";

export const metadata: Metadata = {
	title: "Edit Stationary Combustion",
};

export default async function page(props: { params: Promise<{ id: string; scopeId: string }> }) {
    const params = await props.params;
    return <EditStationaryCombustionData {...params} />
}
