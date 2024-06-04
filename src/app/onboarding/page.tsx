import { Metadata } from "next";
import SetupCompanyProfile from "./SetupCompanyProfile";

export const metadata: Metadata = {
	title: "Setup Company Profile",
};

export default function page() {
	return <SetupCompanyProfile />;
}
