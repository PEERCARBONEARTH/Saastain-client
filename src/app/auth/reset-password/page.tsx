import { Metadata } from "next";
import ResetPassword from "./ResetPassword";
import AppLogo from "@/components/logo/AppLogo";

export const metadata: Metadata = {
	title: "Reset Password",
};

export default function page({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
	const { token, id } = searchParams;
	return (
		<>
			<AppLogo />
			<div className="w-full md:w-[80%] space-y-8 mt-4 mb-7">
				<h1 className="text-5xl font-bold">Password Reset </h1>
			</div>
			<ResetPassword token={token as string} id={id as string} />
		</>
	);
}
