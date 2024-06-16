import { Metadata } from "next";
import BulkAddFleetEmissionsData from "./BulkAddFleetEmissionsData";

export const metadata: Metadata = {
	title: "Fleet Emissions Bulk Data",
};

export default function Page() {
	return <BulkAddFleetEmissionsData />;
}
