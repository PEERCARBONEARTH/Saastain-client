import { Metadata } from "next";
import EditCompanyProfile from "./EditCompanyProfile";

export const metadata: Metadata = {
	title: "Update Company Profile",
};

const page = async (props: { params: Promise<{ id: string }> }) => {
    const params = await props.params;
    return <EditCompanyProfile {...params} />;
};

export default page;
