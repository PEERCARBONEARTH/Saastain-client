"use client";

import { Progress } from "@nextui-org/react";
import { CheckIcon } from "lucide-react";
import { useEffect } from "react";
import toast, { useToaster } from "react-hot-toast";

const OnboardingLoadingScreen = () => {
	let toastList: string[] = ["Generating Your Account", "Configuring  your company", " Confirm Complete"];

	useEffect(() => {
		toastList.forEach((message, index) => {
			setTimeout(() => {
				toast(message, {
					position: "bottom-center",
					duration: 2500,
					id: `${index}`,
					className: "text-[#133726]",
					icon: <CheckIcon />,
				});
			}, index * 2000);
		});
	}, []);

	return (
		<div className="h-screen bg-[#133726]">
			<div className="flex items-center justify-center h-full">
				<div className="flex flex-col text-center">
					<h1 className="text-white text-3xl font-bold">We are creating your account, wait ....</h1>
					<div className="mt-5">
						<p className="text-green-50">Carbon accounting embedded with fintech</p>
					</div>
					<div className="mt-5">
						<Progress size="sm" isIndeterminate classNames={{ indicator: "bg-saastain-brown " }} />
					</div>
				</div>
			</div>
		</div>
	);
};

export default OnboardingLoadingScreen;
