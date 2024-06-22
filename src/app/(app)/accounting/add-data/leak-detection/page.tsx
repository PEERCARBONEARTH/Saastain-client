import FugitiveEmissionsNewAddData from "@/components/accounting/FugitiveEmissionsNewAddData";
import { Metadata } from "next";

export const metadata: Metadata = {
	title: "Leak Detection & Repairs",
};

export default function Page() {
	return <FugitiveEmissionsNewAddData variant="leak-detection" />;
}
