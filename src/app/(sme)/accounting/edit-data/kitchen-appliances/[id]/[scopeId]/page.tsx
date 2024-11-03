import { Metadata } from "next";
import EditStationaryCombustionNewData from "../../../EditStationaryCombustionNewData";

export const metadata: Metadata = {
	title: "Edit Kitchen Appliances",
};

const page = ({ params }: { params: { id: string; scopeId: string } }) => {
	return <EditStationaryCombustionNewData {...params} variant={"kitchen-appliances"} />;
};

export default page;
