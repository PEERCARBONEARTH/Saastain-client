import HeatAndSteamNewAddData from "@/components/accounting/HeatAndSteamNewAddData";
import { Metadata } from "next";

export const metadata: Metadata = {
	title: "Heat & Steam",
};

export default function Page() {
	return <HeatAndSteamNewAddData />;
}
