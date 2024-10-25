import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
	title: "Help",
};

const page = () => {
	redirect("/configuration/help/support");
};

export default page;
