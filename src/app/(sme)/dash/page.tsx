import { Metadata } from "next";
import NewDashboard from "./NewDashboard";

export const metadata: Metadata = {
	title: "New Dashboard",
};

const page = () => {
	return <NewDashboard />;
};

export default page;
