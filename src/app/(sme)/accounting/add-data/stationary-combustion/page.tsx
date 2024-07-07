import { Metadata } from "next";
import AddStationaryCombustionData from "./AddStationaryCombustionsData";

export const metadata: Metadata = {
	title: "Add Stationary Combustion Data",
};

const page = () => {
	return <AddStationaryCombustionData />;
};

export default page;
