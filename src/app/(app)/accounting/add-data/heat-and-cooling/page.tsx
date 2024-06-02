import { Metadata } from "next";
import AddHeatAndCoolingData from "./AddHeatAndCoolingData";

export const metadata: Metadata = {
	title: "Heat & Cooling",
};

const page = () => {
	return <AddHeatAndCoolingData />;
};

export default page;
