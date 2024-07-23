import { Metadata } from "next";
import AppLogo from "@/components/logo/AppLogo";
import OnboardingScreen from "./OnboardingScreen";

export const metadata: Metadata = {
	title: "Account Set Up",
};

export default function page({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
	return (
		<div className="bg-auth h-screen">
			<div className="flex flex-col items-center w-full pt-56 px-[150px]">
				<div className="flex flex-col justify-center h-full">
					<AppLogo />
					<div className="space-y-5 mt-7 mb-10">
						<h1 className="font-bold text-gray-900 text-2xl">Welcome To Your Vendor Portal</h1>
						<p className="text-gray-900">
							Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae
							vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit
						</p>
					</div>
					<OnboardingScreen id={searchParams?.id as string} />
				</div>
			</div>
		</div>
	);
}
