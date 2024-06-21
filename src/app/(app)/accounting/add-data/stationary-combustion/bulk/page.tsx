import { Metadata } from "next";
import BulkAddStationaryCombustion from "./BulkAddStationaryCombustion";

export const metadata: Metadata = {
	title: "Stationary Combustion Bulk Data",
};

export default function Page() {
	return <BulkAddStationaryCombustion />;
}
