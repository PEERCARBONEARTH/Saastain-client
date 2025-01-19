import { Metadata } from "next";
import EditFugitiveEmissionsData from "./EditFugitiveEmissionsData";

export const metadata: Metadata = {
	title: "Edit Fugitive Emissions",
};

export default async function page(props: { params: Promise<{ id: string; scopeId: string }> }) {
    const params = await props.params;
    return <EditFugitiveEmissionsData {...params} />;
}
