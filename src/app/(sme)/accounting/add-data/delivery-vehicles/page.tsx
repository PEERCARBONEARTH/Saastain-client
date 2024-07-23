import FleetEmissionsNewAddData from "@/components/accounting/FleetEmissionsNewAddData";
import { Metadata } from "next";

export const metadata: Metadata = {
	title: "Delivery Vehicles Emissions Data",
};

export default function Page() {
	return <FleetEmissionsNewAddData variant="delivery-vehicles" />;
}
