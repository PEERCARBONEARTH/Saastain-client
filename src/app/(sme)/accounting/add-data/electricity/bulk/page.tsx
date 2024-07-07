import { Metadata } from "next";
import BulkAddElectricityData from "./BulkAddElectricityData";

export const metadata: Metadata = {
	title: "Bulk Add Electricity",
};

export default function Page() {
	return <BulkAddElectricityData />;
}
