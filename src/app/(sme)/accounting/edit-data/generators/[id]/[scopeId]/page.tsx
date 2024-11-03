import { Metadata } from "next";
import EditStationaryCombustionNewData from "../../../EditStationaryCombustionNewData";

export const metadata: Metadata = {
	title: "Edit Generators' Emissions",
};

const page = ({ params }: { params: { id: string; scopeId: string } }) => {
	return <EditStationaryCombustionNewData {...params} variant="generators" />;
};

export default page;
