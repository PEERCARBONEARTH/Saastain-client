import { Metadata } from "next";
import EditFugitiveEmissionsNewData from "../../../EditFugitiveEmissionsNewData";

export const metadata: Metadata = {
	title: "Edit Leak Detection & Repair Emissions",
};

const page = async (props: { params: Promise<{ id: string; scopeId: string }> }) => {
    const params = await props.params;
    return <EditFugitiveEmissionsNewData {...params} variant={"leak-detection"} />;
};

export default page;
