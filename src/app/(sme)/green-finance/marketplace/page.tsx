import { Metadata } from "next";
import AppMarketPlace from "./AppMarketplace";

export const metadata: Metadata = {
	title: "Our Marketplace",
};

export default function page() {
	return <AppMarketPlace />;
}
