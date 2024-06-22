import FugitiveEmissionsNewAddData from "@/components/accounting/FugitiveEmissionsNewAddData";
import { Metadata } from "next";

export const metadata: Metadata = {
	title: "Refrigeration Units",
};

export default function Page() {
	return <FugitiveEmissionsNewAddData variant="refrigeration-units" />;
}
