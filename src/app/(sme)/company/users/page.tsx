import { Metadata } from "next";
import CompanyUsers from "./CompanyUsers";

export const metadata: Metadata = {
	title: "Company Users",
};

export default function page() {
	return <CompanyUsers />;
}
