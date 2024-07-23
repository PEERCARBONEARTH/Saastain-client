import FugitiveEmissionsNewAddData from "@/components/accounting/FugitiveEmissionsNewAddData";
import { Metadata } from "next";

export const metadata: Metadata = {
	title: "Industrial Equipments",
};

export default function Page() {
	return <FugitiveEmissionsNewAddData variant="industrial-equipments" />;
}
