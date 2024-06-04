import { Metadata } from "next";
import AddElectricityData from "./AddElectricityData";

export const metadata: Metadata = {
	title: "Electricity Consumption Data",
};

const page = () => {
	return <AddElectricityData />;
};

export default page;
