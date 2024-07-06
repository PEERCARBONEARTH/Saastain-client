import { Metadata } from "next";
import Login from "./Login";
import AppLogo from "@/components/logo/AppLogo";

export const metadata: Metadata = {
	title: "Login",
};

const page = () => {
	return (
		<>
			<AppLogo />
			<div className="w-full md:w-[80%] space-y-8 mt-4 mb-7">
				<h1 className="text-5xl font-bold">Login to your account </h1>
			</div>
			<Login />;
		</>
	);
};

export default page;
