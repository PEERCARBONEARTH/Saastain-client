import { Metadata } from "next";
import EmissionReports from "./EmissionReports";

export const metadata: Metadata = {
	title: "Emission Reports",
};

const page = () => {
	return <EmissionReports />;
};

export default page;
