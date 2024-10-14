import { Metadata } from "next";
import AccountSecurity from "./AccountSecurity";

export const metadata: Metadata = {
	title: "Account Security",
};

const page = () => {
	return <AccountSecurity />;
};

export default page;
