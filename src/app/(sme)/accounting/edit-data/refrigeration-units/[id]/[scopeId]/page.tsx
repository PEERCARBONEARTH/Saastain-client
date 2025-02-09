import { Metadata } from "next";
import EditFugitiveEmissionsNewData from "../../../EditFugitiveEmissionsNewData";

export const metadata: Metadata = {
	title: "Edit Refrigeration Emissions",
};

const page = async (props: { params: Promise<{ id: string; scopeId: string }> }) => {
    const params = await props.params;
    return <EditFugitiveEmissionsNewData {...params} variant={"refrigeration-units"} />;
};

export default page;
