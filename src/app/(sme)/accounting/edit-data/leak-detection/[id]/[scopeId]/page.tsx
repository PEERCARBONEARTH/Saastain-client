import { Metadata } from "next";
import EditFugitiveEmissionsNewData from "../../../EditFugitiveEmissionsNewData";

export const metadata: Metadata = {
	title: "Edit Leak Detection & Repair Emissions",
};

const page = ({ params }: { params: { id: string; scopeId: string } }) => {
	return <EditFugitiveEmissionsNewData {...params} variant={"leak-detection"} />;
};

export default page;
