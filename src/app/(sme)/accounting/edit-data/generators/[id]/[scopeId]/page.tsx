import { Metadata } from "next";
import EditStationaryCombustionNewData from "../../../EditStationaryCombustionNewData";

export const metadata: Metadata = {
	title: "Edit Generators' Emissions",
};

const page = async (props: { params: Promise<{ id: string; scopeId: string }> }) => {
    const params = await props.params;
    return <EditStationaryCombustionNewData {...params} variant="generators" />;
};

export default page;
