import AppLogo from "@/components/logo/AppLogo";
import { Button } from "@nextui-org/react";
import { CheckIcon, Share2Icon } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
	title: "Register Success",
};

export default function Page() {
	return (
		<>
			<div className="mb-4">
				<AppLogo />
			</div>
			<div className="w-full md:w-[70%] flex gap-5 bg-[#F6FDF9] p-7 rounded-lg">
				<CheckIcon className="text-success" />
				<div className="space-y-3">
					<h2 className="text-success font-bold">Success</h2>
					<p className="text-success font-normal">Your interest has been submitted successfully . One of our representatives will get in touch with you </p>
				</div>
			</div>
			<div className="mt-10">
				<Button color="primary" endContent={<Share2Icon className="w-4 h-4" />}>
					Refer Another Vendor
				</Button>
			</div>
		</>
	);
}
