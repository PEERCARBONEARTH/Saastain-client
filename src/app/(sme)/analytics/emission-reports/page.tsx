import { Metadata } from "next";
import EmissionReports from "./EmissionReports";
import EmissionReportsNew from "./EmissionReportsNew";

export const metadata: Metadata = {
	title: "Emission Reports",
};

const page = () => {
	return <EmissionReportsNew />;
};

export default page;
