"use client";

import { Button } from "@/components/ui/button";
import { Card, CardBody, CardFooter, Divider } from "@nextui-org/react";
import { HelpCircleIcon, LayoutGrid, MenuIcon } from "lucide-react";

const CompleteSetup = () => {
	/**
	 * @Todo
	 * Pending Card Message
	 */
	return (
		<div className="h-screen flex  items-center text-neutral-500">
			<Card className="w-2/6  mx-auto py-8 px-4 space-y-2  border-[10px] border-green-900/10">
				<CardBody>
					<h1 className="text-3xl  font-semibold my-4 text-saastain-green">Welcome to Saastain</h1>
					<p>We are updating your company profile to ensure effectively track your emissions</p>
				</CardBody>
				<Divider />
				<CardFooter className="flex flex-row justify-between">
					<Button variant="outline" size="sm" className="space-x-2  hover:text-green-500">
						<span>Learn More</span>
						{/* <HelpCircleIcon className="text-xs" /> */}
					</Button>
					<Button variant="default" size="sm" className="space-x-2 hover:bg-green-900">
						<span>Dashboard</span> <LayoutGrid />
					</Button>
				</CardFooter>
			</Card>
		</div>
	);
};

export default CompleteSetup;
