import { Metadata } from "next";
import SupportPage from "./SupportPage";

export const metadata: Metadata = {
	title: "Support",
};

const page = () => {
	return <SupportPage />;
};

export default page;
