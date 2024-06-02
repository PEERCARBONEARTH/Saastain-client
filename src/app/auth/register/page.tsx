import { Metadata } from "next";
import SignUp from "./SignUp";

export const metadata: Metadata = {
	title: "Sign Up",
};

const page = () => {
	return <SignUp />;
};

export default page;
