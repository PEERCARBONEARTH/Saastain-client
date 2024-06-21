import { Metadata } from "next";
import BulkAddHeatAndCoolingData from "./BulkAddHeatAndCoolingData";

export const metadata: Metadata = {
	title: "Bulk Add Heat and Cooling",
};

export default function Page() {
	return <BulkAddHeatAndCoolingData />;
}
