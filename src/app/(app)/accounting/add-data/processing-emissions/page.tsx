import { Metadata } from "next";
import AddProcessingEmissions from "./AddProcessingEmissions";

export const metadata: Metadata = {
	title: "Add Processing Emissions Data",
};

const page = () => {
	return <AddProcessingEmissions />
};

export default page;
