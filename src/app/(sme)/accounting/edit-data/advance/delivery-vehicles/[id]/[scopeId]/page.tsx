import { Metadata } from "next";
import EditAdvanceFleetEmissionsData from "../../../EditAdvanceFleetEmissionsData";

export const metadata: Metadata = {
	title: "Edit Delivery Vehicles Emissions",
};

export default function page({ params }: { params: { id: string; scopeId: string } }) {
	return <EditAdvanceFleetEmissionsData {...params} variant={"delivery-vehicles"} />;
}
