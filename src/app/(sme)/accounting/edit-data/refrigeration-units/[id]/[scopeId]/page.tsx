import { Metadata } from "next";
import EditFugitiveEmissionsNewData from "../../../EditFugitiveEmissionsNewData";

export const metadata: Metadata = {
	title: "Edit Refrigeration Emissions",
};

const page = ({ params }: { params: { id: string; scopeId: string } }) => {
	return <EditFugitiveEmissionsNewData {...params} variant={"refrigeration-units"} />;
};

export default page;
