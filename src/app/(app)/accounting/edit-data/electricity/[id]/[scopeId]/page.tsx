import { Metadata } from "next";
import EditElectricityData from "./EditElectricityData";

export const metadata: Metadata = {
	title: "Edit Electricity Data",
};

export default function Page({ params }: { params: { id: string; scopeId: string } }) {
	return <EditElectricityData {...params} />;
}
