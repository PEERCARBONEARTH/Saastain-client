import { Metadata } from "next";
import EditStationaryCombustionNewData from "../../../EditStationaryCombustionNewData";

export const metadata: Metadata = {
	title: "Edit Boilers & Furnaces",
};

const page = ({ params }: { params: { id: string; scopeId: string } }) => {
	return <EditStationaryCombustionNewData {...params} variant="boilers-and-furnaces" />;
};

export default page;
