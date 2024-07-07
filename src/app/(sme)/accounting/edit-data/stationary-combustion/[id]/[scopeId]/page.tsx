import { Metadata } from "next";
import EditStationaryCombustionData from "./EditStationaryCombustionData";

export const metadata: Metadata = {
	title: "Edit Stationary Combustion",
};

export default function page({ params }: { params: { id: string; scopeId: string } }) {
	return <EditStationaryCombustionData {...params} />
}
