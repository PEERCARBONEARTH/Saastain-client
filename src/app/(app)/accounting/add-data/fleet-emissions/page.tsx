import { Metadata } from "next";
import AddFleetEmissions from "./AddFleetEmissions";

export const metadata: Metadata = {
	title: "Fleet Emissions",
};

const page = () => {
	return <AddFleetEmissions />;
};

export default page;
