import { Metadata } from "next";
import EditFugitiveEmissionsNewData from "../../../EditFugitiveEmissionsNewData";

export const metadata: Metadata = {
	title: "Edit Air Conditioning System Emissions",
};

const page = ({ params }: { params: { id: string; scopeId: string } }) => {
	return <EditFugitiveEmissionsNewData {...params} variant="air-conditioning-systems" />;
};

export default page;
