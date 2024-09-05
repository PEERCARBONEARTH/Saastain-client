import { Metadata } from "next";
import SLADocument from "./SLADocument";

export const metadata: Metadata = {
	title: "SLA Document",
};

export default function Page({ params }: { params: { token: string } }) {
	return <SLADocument {...params} />;
}
