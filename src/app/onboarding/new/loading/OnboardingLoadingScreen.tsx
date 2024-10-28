"use client";

import { Progress } from "@nextui-org/react";
import { CheckIcon } from "lucide-react";

const OnboardingLoadingScreen = () => {
	return (
		<div className="h-screen bg-[#133726]">
			<div className="flex items-center justify-center h-full">
				<div className="flex flex-col text-center">
					<h1 className="text-white text-3xl font-bold">We are creating your account, wait ....</h1>
					<div className="mt-5">
						<p className="text-green-50">Carbon accounting embedded with fintech</p>
					</div>
					<div className="mt-5">
						<Progress isIndeterminate classNames={{ indicator: "bg-saastain-brown" }} />
					</div>
					<div className="mt-5 flex items-center justify-center gap-2">
						<p className="text-gray-300">Creating User Profile</p>
						<span>
							<CheckIcon className="text-gray-300 w-5 h-5" />
						</span>
					</div>
				</div>
			</div>
		</div>
	);
};

export default OnboardingLoadingScreen;
