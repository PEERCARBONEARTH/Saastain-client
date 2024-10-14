import { Metadata } from "next";
import AccountGeneral from "./AccountGeneral";

export const metadata: Metadata = {
	title: "General Account Config",
};

const page = () => {
	return <AccountGeneral />;
};

export default page;
