import { Metadata } from "next";
import NetZero from "./NetZeroPage";

export const metadata: Metadata = {
	title: "Net Zero",
};

const page = () => {
	return <NetZero />;
};

export default page;
