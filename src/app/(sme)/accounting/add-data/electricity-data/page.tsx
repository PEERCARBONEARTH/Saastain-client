import ElectricityEmissionsNewAddData from "@/components/accounting/ElectricityEmissionsNewAddData";
import { Metadata } from "next";

export const metadata: Metadata = {
	title: "Electricity Emissions",
};

export default function Page() {
	return <ElectricityEmissionsNewAddData />;
}
