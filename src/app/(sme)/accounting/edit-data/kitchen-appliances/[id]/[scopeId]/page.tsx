import { Metadata } from "next";
import EditStationaryCombustionNewData from "../../../EditStationaryCombustionNewData";

export const metadata: Metadata = {
	title: "Edit Kitchen Appliances",
};

const page = async (props: { params: Promise<{ id: string; scopeId: string }> }) => {
    const params = await props.params;
    return <EditStationaryCombustionNewData {...params} variant={"kitchen-appliances"} />;
};

export default page;
