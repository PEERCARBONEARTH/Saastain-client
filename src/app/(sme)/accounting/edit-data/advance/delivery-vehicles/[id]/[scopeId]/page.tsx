import { Metadata } from "next";
import EditAdvanceFleetEmissionsData from "../../../EditAdvanceFleetEmissionsData";

export const metadata: Metadata = {
	title: "Edit Delivery Vehicles Emissions",
};

export default async function page(props: { params: Promise<{ id: string; scopeId: string }> }) {
    const params = await props.params;
    return <EditAdvanceFleetEmissionsData {...params} variant={"delivery-vehicles"} />;
}
