import FugitiveEmissionsNewAddData from "@/components/accounting/FugitiveEmissionsNewAddData";
import { Metadata } from "next";

export const metadata: Metadata = {
	title: "Air Conditioning System",
};

export default function Page() {
	return <FugitiveEmissionsNewAddData variant="air-conditioning-systems" />;
}
