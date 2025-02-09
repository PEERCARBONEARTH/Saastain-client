import { Metadata } from "next";
import SLADocument from "./SLADocument";

export const metadata: Metadata = {
	title: "SLA Document",
};

export default async function Page(props: { params: Promise<{ token: string }> }) {
    const params = await props.params;
    return <SLADocument {...params} />;
}
