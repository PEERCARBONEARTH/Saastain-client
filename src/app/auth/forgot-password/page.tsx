import { Metadata } from "next";
import ForgotPassword from "./ForgotPassword";
import AppLogo from "@/components/logo/AppLogo";

export const metadata: Metadata = {
	title: "Forgot Password",
};

export default function page() {
	return (
		<>
			<AppLogo />
			<div className="w-full md:w-[80%] space-y-8 mt-4 mb-7">
				<h1 className="text-5xl font-bold">Request Password Reset </h1>
			</div>
			<ForgotPassword />
		</>
	);
}
