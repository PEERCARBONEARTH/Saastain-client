import { Metadata } from "next";
import CompanyProfile from "./CompanyProfile";

export const metadata: Metadata = {
	title: "Company Profile",
};

export default function page({ params }: { params: { id: string } }) {
	return <CompanyProfile id={params.id} />;
}
