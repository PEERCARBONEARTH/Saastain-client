import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
	title: "Team",
};

const page = () => {
	redirect("/configuration/team/equipments");
};

export default page;
