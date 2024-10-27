import { Metadata } from "next";
import NewBranchScreen from "./NewBranchScreen";

export const metadata: Metadata = {
	title: "New Branch",
};

const page = () => {
	return <NewBranchScreen />;
};

export default page;
