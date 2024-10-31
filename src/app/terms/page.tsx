import MainLayout from "@/layouts/MainLayout";
import { Metadata } from "next";

export const metadata: Metadata = {
	title: "Terms of Service",
};

const page = () => {
	return (
		<MainLayout>
			<h1 className="text-5xl font-bold text-center pt-3">Terms of Service</h1>
		</MainLayout>
	);
};

export default page;
