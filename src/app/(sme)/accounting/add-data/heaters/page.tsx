import StationaryCombustionNewAddData from "@/components/accounting/StationaryCombustionNewAddData";
import { Metadata } from "next";

export const metadata: Metadata = {
	title: "Heaters Add Data",
};

export default function Page() {
	return <StationaryCombustionNewAddData variant="heater" />;
}
