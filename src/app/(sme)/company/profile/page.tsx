import { Metadata } from "next";
import MyCompanyProfile from "./MyCompanyProfile";

export const metadata: Metadata = {
	title: "My Company Profile",
};

export default function page() {
	return <MyCompanyProfile />;
}
