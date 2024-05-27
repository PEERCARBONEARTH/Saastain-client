import { Metadata } from "next";
import Loans from "./Loans";

export const metadata: Metadata = {
	title: "Loans",
};

export default function page() {
	return <Loans />;
}
