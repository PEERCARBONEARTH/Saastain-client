import { Metadata } from "next";
import NewCompany from "./NewCompany";

export const metadata: Metadata = {
	title: "New Company",
};

export default function Page() {
	return <NewCompany />;
}
