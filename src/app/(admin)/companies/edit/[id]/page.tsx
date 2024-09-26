import { Metadata } from "next";
import EditCompanyProfile from "./EditCompanyProfile";

export const metadata: Metadata = {
	title: "Update Company Profile",
};

const page = ({ params }: { params: { id: string } }) => {
	return <EditCompanyProfile {...params} />;
};

export default page;
