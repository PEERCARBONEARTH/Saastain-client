import { Metadata } from "next";
import EditStationaryCombustionNewData from "../../../EditStationaryCombustionNewData";

export const metadata: Metadata = {
	title: "Edit Heater Emissions",
};

const page = ({ params }: { params: { id: string; scopeId: string } }) => {
	return <EditStationaryCombustionNewData {...params} variant={"heater"} />;
};

export default page;
