import StationaryCombustionNewAddData from "@/components/accounting/StationaryCombustionNewAddData";
import { Metadata } from "next";

export const metadata: Metadata = {
	title: "Generators Add Data",
};

export default function Page() {
	return <StationaryCombustionNewAddData variant="generators" />;
}
