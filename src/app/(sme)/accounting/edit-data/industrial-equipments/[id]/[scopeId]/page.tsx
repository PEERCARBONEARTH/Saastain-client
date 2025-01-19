import { Metadata } from "next";
import EditProcessingEmissionsNewData from "../../../EditProcessingEmissionsNewData";
import { ProcessingEmissionAddVariant } from "@/types/ProcessingAndFugitive";

export const metadata: Metadata = {
	title: "Edit Industrial Equipments Emissions",
};

const page = async (props: { params: Promise<{ id: string; scopeId: string }> }) => {
    const params = await props.params;
    return <EditProcessingEmissionsNewData {...params} variant={ProcessingEmissionAddVariant.CHEMICAL_REACTIONS} />;
};

export default page;
