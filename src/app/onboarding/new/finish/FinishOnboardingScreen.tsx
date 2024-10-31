"use client";

import { AppEnumRoutes } from "@/types/AppEnumRoutes";
import { Button, Card, CardBody, CardFooter, CardHeader, Divider } from "@nextui-org/react";
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const FinishOnboardingScreen = () => {
	return (
		<div className="grid grid-cols-1">
			<div className="h-screen">
				<div className="flex items-center justify-center h-full">
					<Card className="max-w-xl w-full px-5 py-4">
						<CardHeader>
							<h1 className="text-2xl font-bold">Updating your company</h1>
						</CardHeader>
						<CardBody className="gap-4">
							<p className="font-medium">You have updated your companies boundaries , and set up your branches. Let's begin your emission tracking</p>
							<Image src={"/images/onboarding/stars.png"} width={150} height={80} alt="Stars" />
						</CardBody>
						<Divider />
						<CardFooter className="justify-end">
							<Button color="primary" as={Link} href={AppEnumRoutes.APP_DASHBOARD} className="bg-primary-800" endContent={<ChevronRight className="w-5 h-5" />}>
								Open Dashboard
							</Button>
						</CardFooter>
					</Card>
				</div>
			</div>
		</div>
	);
};

export default FinishOnboardingScreen;
