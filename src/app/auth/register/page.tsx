import { Metadata } from "next";
import AuthRegister from "./AuthRegister";
import AppLogo from "@/components/logo/AppLogo";

export const metadata: Metadata = {
	title: "Get Started",
};

const page = () => {
	return (
		<>
			<AppLogo />
			<div className="w-full md:w-[80%] space-y-8 mt-4 mb-5">
				<h1 className="text-5xl font-bold">At vero eos et accusamus et iusto odio dignissimos ducimus qui </h1>
				<h3 className="text-gray-700">
					At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non
					provident, similique sunt in culpa qui
				</h3>
			</div>
			<AuthRegister />
		</>
	);
};

export default page;
