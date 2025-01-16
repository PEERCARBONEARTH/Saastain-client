import { Metadata } from "next";
import AccountSubscriptions from "./AccountSubscriptions";

export const metadata: Metadata = {
	title: "Subscriptions",
};

const page = () => {
	return <AccountSubscriptions />
};

export default page;
