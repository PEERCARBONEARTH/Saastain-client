import { Metadata } from "next";
import EditHeatAndCoolingData from "./EditHeatAndCoolingData";

export const metadata: Metadata = {
	title: "Edit Heat & Cooling Data",
};

export default async function page(props: { params: Promise<{ id: string; scopeId: string }> }) {
    const params = await props.params;
    return <EditHeatAndCoolingData {...params} />;
}
