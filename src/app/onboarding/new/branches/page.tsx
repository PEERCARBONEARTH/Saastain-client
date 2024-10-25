import { Metadata } from "next";
import BranchesListingScreen from "./BranchesListingScreen";

export const metadata: Metadata = {
	title: "Branches Listing",
};

const page = () => {
	return <BranchesListingScreen />;
};

export default page;
