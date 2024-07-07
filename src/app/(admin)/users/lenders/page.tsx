import { Metadata } from "next";
import AppLendersOverview from "./AppLendersOverview";

export const metadata: Metadata = {
	title: "Lenders",
	description: "Lenders Overview",
};

export default function page() {
	return <AppLendersOverview />;
}
