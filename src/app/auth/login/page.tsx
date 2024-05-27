import { Metadata } from "next";
import Login from "./Login";

export const metadata: Metadata = {
	title: "Login",
};

const page = () => {
	return <Login />;
};

export default page;
