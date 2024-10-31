import { Metadata } from "next";
import GetStartedScreen from "./GetStartedScreen";

export const metadata: Metadata = {
	title: "Get Started",
};

const page = () => {
	return <GetStartedScreen />;
};

export default page;
