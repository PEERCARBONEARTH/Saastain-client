import AdvanceFleetEmissionsAddData from "@/components/accounting/AdvanceFleetEmissionsAddData";
import { Metadata } from "next";

export const metadata: Metadata = {
	title: "Advance - Add Data Fleet Emissions",
};

export default function Page() {
	return <AdvanceFleetEmissionsAddData variant="passenger-vehicles" />;
}
