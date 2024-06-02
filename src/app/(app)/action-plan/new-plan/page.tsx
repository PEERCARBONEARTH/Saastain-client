import { Metadata } from "next";
import NewPlan from "./NewPlanPage";

export const metadata: Metadata = {
	title: "New Plan",
};

const page = () => {
	return <NewPlan />;
};

export default page;
