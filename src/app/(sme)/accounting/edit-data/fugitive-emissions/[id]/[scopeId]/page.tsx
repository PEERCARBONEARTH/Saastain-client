import { Metadata } from "next";
import EditFugitiveEmissionsData from "./EditFugitiveEmissionsData";

export const metadata: Metadata = {
	title: "Edit Fugitive Emissions",
};

export default function page({ params }: { params: { id: string; scopeId: string } }) {
	return <EditFugitiveEmissionsData {...params} />;
}
