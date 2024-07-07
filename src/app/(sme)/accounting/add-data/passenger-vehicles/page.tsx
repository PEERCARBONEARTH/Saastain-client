import FleetEmissionsNewAddData from "@/components/accounting/FleetEmissionsNewAddData";
import { Metadata } from "next";

export const metadata: Metadata = {
	title: "Passenger Vehicles Emissions Data",
};

export default function Page() {
	return <FleetEmissionsNewAddData variant="passenger-vehicles" />;
}
