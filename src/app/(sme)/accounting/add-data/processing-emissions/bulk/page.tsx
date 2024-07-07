import { Metadata } from "next";
import BulkAddProcessingEmissionsData from "./BulkAddProcessingEmissionsData";

export const metadata: Metadata = {
	title: "Processing Emissions Bulk Data",
};

export default function Page() {
	return <BulkAddProcessingEmissionsData />;
}
