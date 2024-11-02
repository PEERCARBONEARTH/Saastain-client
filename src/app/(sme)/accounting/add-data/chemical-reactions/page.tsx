import ChemicalReactionsEmissionsNewAddData from "@/components/accounting/ChemicalReactionsEmissionsNewAddData";
import { ProcessingEmissionAddVariant } from "@/types/ProcessingAndFugitive";
import { Metadata } from "next";

export const metadata: Metadata = {
	title: "Chemical Reactions",
};

export default function Page() {
	return <ChemicalReactionsEmissionsNewAddData variant={ProcessingEmissionAddVariant.CHEMICAL_REACTIONS} />;
}
