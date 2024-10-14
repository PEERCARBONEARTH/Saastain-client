import { Metadata } from "next";
import TeamEquipments from "./TeamEquipments";

export const metadata: Metadata = {
	title: "Equipments",
};

const page = () => {
	return <TeamEquipments />;
};

export default page;
