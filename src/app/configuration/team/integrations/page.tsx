import { Metadata } from "next";
import AppIntegrations from "./AppIntegrations";

export const metadata: Metadata = {
	title: "Integrations",
};

const page = () => {
	return <AppIntegrations />;
};

export default page;
