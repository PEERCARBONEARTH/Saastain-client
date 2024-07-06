import { Metadata } from "next";
import AuthRegister from "./AuthRegister";

export const metadata: Metadata = {
	title: "Get Started",
};

const page = () => {
	return <AuthRegister />;
};

export default page;
