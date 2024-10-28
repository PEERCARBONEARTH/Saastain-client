import { Metadata } from "next";
import CompanyType from "./CompanyType";

export const metadata: Metadata = {
	title: "Company Type",
};

const page = () => {
	return <CompanyType />;
};

export default page;
