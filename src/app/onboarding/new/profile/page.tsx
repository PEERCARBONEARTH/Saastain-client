import { Metadata } from "next";
import CreateCompanyProfile from "./CreateCompanyProfile";

export const metadata: Metadata = {
	title: "Create Company Profile",
};

const page = () => {
	return <CreateCompanyProfile />;
};

export default page;
