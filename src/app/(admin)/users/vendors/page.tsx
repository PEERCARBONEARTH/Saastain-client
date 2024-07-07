import { Metadata } from "next";
import VendorsOverview from "./VendorsOverview";

export const metadata: Metadata = {
	title: "Vendors",
};

export default function Page() {
	return <VendorsOverview />
}
