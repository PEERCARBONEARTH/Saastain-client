import { Metadata } from "next";
import EditAdvanceFleetEmissionsData from "../../../EditAdvanceFleetEmissionsData";

export const metadata: Metadata = {
	title: "Edit Passenger Vehicles Emissions",
};

const page = ({ params }: { params: { id: string; scopeId: string } }) => {
	return <EditAdvanceFleetEmissionsData {...params} variant={"passenger-vehicles"} />;
};

export default page;
