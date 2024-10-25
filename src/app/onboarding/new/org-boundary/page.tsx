import { Metadata } from "next";
import OrgBoundaryScreen from "./OrgBoundaryScreen";

export const metadata: Metadata = {
	title: "Org Boundary",
};

const page = () => {
	return <OrgBoundaryScreen />;
};

export default page;
