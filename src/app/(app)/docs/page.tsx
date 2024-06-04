import { Metadata } from "next";
import AppDocs from "./AppDocs";

export const metadata: Metadata = {
	title: "Docs",
};

const page = () => {
	return <AppDocs />;
};

export default page;
