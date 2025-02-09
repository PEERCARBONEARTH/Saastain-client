import { Metadata } from "next";
import CompanyProfile from "./CompanyProfile";

export const metadata: Metadata = {
	title: "Company Profile",
};

export default async function page(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    return <CompanyProfile id={params.id} />;
}
