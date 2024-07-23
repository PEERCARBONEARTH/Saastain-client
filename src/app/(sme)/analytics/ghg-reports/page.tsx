import { Metadata } from "next";
import GHGReports from "./GHGReports";

export const metadata: Metadata = {
	title: "GHG Reports",
};

const page = () => {
	return <GHGReports />;
};

export default page;
