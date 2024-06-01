import { Metadata } from "next";
import EditHeatAndCoolingData from "./EditHeatAndCoolingData";

export const metadata: Metadata = {
	title: "Edit Heat & Cooling Data",
};

export default function page({ params }: { params: { id: string; scopeId: string } }) {
	return <EditHeatAndCoolingData {...params} />;
}
