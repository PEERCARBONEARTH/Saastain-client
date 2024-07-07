import { Metadata } from "next";
import AppDashboard from "./Dashboard";

export const metadata: Metadata = {
	title: "Dashboard",
};

const page = () => {
	return <AppDashboard />;
};

export default page;
