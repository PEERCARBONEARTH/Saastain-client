import StationaryCombustionNewAddData from "@/components/accounting/StationaryCombustionNewAddData";
import { Metadata } from "next";

export const metadata: Metadata = {
	title: "Kitchen Appliances Add Data",
};

export default function Page() {
	return <StationaryCombustionNewAddData variant="kitchen-appliances" />;
}
