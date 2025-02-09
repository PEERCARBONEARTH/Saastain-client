import MainLayout from "@/layouts/MainLayout";
import PricingScreen from "./PricingScreen";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Pricing'
}

const page = () => {
	return (
		<MainLayout>
			<PricingScreen />
		</MainLayout>
	);
};

export default page;
