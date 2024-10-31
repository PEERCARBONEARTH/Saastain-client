import { Metadata } from "next";
import GetStarted from "./GetStarted";

export const metadata: Metadata = {
	title: "Get Started",
};

const page = () => {
	return <GetStarted />;
};

export default page;
