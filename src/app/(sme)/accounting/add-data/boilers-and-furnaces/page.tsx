import StationaryCombustionNewAddData from "@/components/accounting/StationaryCombustionNewAddData";
import { Metadata } from "next";

export const metadata: Metadata = {
	title: "Boilers and Furnaces",
};

export default function Page() {
	return <StationaryCombustionNewAddData variant="boilers-and-furnaces" />;
}
