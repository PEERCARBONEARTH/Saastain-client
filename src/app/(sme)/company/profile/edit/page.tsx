import { Metadata } from "next";
import EditCompanyProfile from "./EditCompanyProfile";

export const metadata: Metadata = {
	title: "Edit Company Profile",
};

export default function Page() {
	return <EditCompanyProfile />;
}
