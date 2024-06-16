import { Metadata } from "next";
import BulkAddFugitiveData from "./BulkAddFugitiveData";

export const metadata: Metadata = {
	title: "Fugitive Emission Bulk Data",
};

export default function Page() {
	return <BulkAddFugitiveData />;
}
