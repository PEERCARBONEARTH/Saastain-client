import { Metadata } from "next";
import EditElectricityData from "./EditElectricityData";

export const metadata: Metadata = {
	title: "Edit Electricity Data",
};

export default async function Page(props: { params: Promise<{ id: string; scopeId: string }> }) {
    const params = await props.params;
    return <EditElectricityData {...params} />;
}
