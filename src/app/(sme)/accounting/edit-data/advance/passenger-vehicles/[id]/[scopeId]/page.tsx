import { Metadata } from "next";
import EditAdvanceFleetEmissionsData from "../../../EditAdvanceFleetEmissionsData";

export const metadata: Metadata = {
	title: "Edit Passenger Vehicles Emissions",
};

const page = async (props: { params: Promise<{ id: string; scopeId: string }> }) => {
    const params = await props.params;
    return <EditAdvanceFleetEmissionsData {...params} variant={"passenger-vehicles"} />;
};

export default page;
