import { Metadata } from "next";
import AppSettings from "./AppSettings";

export const metadata: Metadata = {
	title: "Settings",
};

export default function page() {
	return <AppSettings />;
}
