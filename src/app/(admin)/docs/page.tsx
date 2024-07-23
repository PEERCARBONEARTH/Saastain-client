import { Metadata } from "next";
import AppDocs from "./AppDocs";

export const metadata: Metadata = {
	title: "Docs",
};

export default function page() {
	return <AppDocs />
}
