import ChemicalReactionsEmissionsNewAddData from "@/components/accounting/ChemicalReactionsEmissionsNewAddData";
import FugitiveEmissionsNewAddData from "@/components/accounting/FugitiveEmissionsNewAddData";
import { ProcessingEmissionAddVariant } from "@/types/ProcessingAndFugitive";
import { Metadata } from "next";

export const metadata: Metadata = {
	title: "Industrial Equipments",
};

export default function Page() {
	return <ChemicalReactionsEmissionsNewAddData variant={ProcessingEmissionAddVariant.INDUSTRIAL_EQUIPMENTS} />;
}
