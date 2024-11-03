import { Metadata } from "next";
import EditProcessingEmissionsNewData from "../../../EditProcessingEmissionsNewData";
import { ProcessingEmissionAddVariant } from "@/types/ProcessingAndFugitive";

export const metadata: Metadata = {
	title: "Edit Industrial Equipments Emissions",
};

const page = ({ params }: { params: { id: string; scopeId: string } }) => {
	return <EditProcessingEmissionsNewData {...params} variant={ProcessingEmissionAddVariant.CHEMICAL_REACTIONS} />;
};

export default page;
