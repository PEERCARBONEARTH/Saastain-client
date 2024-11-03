"use client";
import AuthRedirectComponent from "@/components/auth/AuthRedirectComponent";
import { AppEnumRoutes } from "@/types/AppEnumRoutes";
import { Button, Card, CardBody, CardFooter, Divider, Skeleton, Spacer } from "@nextui-org/react";
import { CheckIcon, ChevronRight } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useMemo } from "react";

interface WelcomeCardItemProps {
	subject: string;
	subjectDescription: string;
	title: string;
	description: string;
	btnText: string;
	href: string;
}

const cardItems = [
	{
		subject: "New Emission Added",
		subjectDescription: "You have successfully recorded an emission",
		title: "Record Your Emissions",
		description: "Track and manage your emissions effortlessly with our intuitive platform.",
		btnText: "Add Data",
		href: AppEnumRoutes.APP_ADD_DATA,
	},
	{
		subject: "New Equipment Added",
		subjectDescription: "You have successfully saved new equipment(s)",
		title: "Configure Equipments",
		description: "Manage and configure your equipment with ease using the Configurator",
		btnText: "Configure",
		href: AppEnumRoutes.APP_CONFIGURATION,
	},
	{
		subject: "New Team Member Invited",
		subjectDescription: "You have successfully invites new team member",
		title: "Invite Team Members",
		description: "Invite and collaborate with your team members seamlessly.",
		btnText: "Invite",
		href: AppEnumRoutes.APP_COMPANY_USERS,
	},
];

const WelcomeScreen = () => {
	const { data: session } = useSession();

	const account = useMemo(() => {
		if (session?.user) {
			return session?.user;
		}

		return session?.user;
	}, [session]);

	return (
		<AuthRedirectComponent>
			<div className="px-0 md:px-5 py-0 md:py-6">
				<h1 className="text-3xl font-bold">Welcome {account?.company?.companyName}</h1>
				<p className="text-sm font-medium text-gray-700">Saastain is a Next-gen SaaS tool that simplifies your carbon accounting</p>
				<div className="mt-5">
					<h3 className="text-sm text-gray-700">Try things out</h3>
				</div>
				<div className="mt-5">
					<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
						{cardItems.map((item, idx) => (
							<WelcomeCardItem {...item} key={idx} />
						))}
					</div>
				</div>
			</div>
		</AuthRedirectComponent>
	);
};

const WelcomeCardItem = ({ subject, subjectDescription, title, description, btnText, href }: WelcomeCardItemProps) => {
	return (
		<Card>
			<CardBody>
				<div className="bg-[#b1d6cb] rounded-xl pl-5 py-5">
					<div className="w-full p-5 bg-white rounded-xl">
						<div className="w-full flex items-center gap-3">
							<div>
								<Skeleton className="flex rounded-xl w-12 h-12" />
							</div>
							<div className="w-full flex flex-col gap-2">
								<Skeleton className="h-3 w-4/5 rounded-xl" />
								<Skeleton className="h-3 w-3/5 rounded-xl" />
								<Skeleton className="h-3 w-2/5 rounded-xl" />
							</div>
						</div>
					</div>
					<Spacer y={4} />
					<div className="w-full p-5 bg-white rounded-xl">
						<div className="w-full flex items-center gap-3">
							<div>
								<div className="flex items-center justify-center w-12 h-12 bg-[#b1d6cb] rounded-lg">
									<CheckIcon className="text-primary" />
								</div>
							</div>
							<div className="w-full flex flex-col gap-2">
								<h3 className="text-primary-700 font-extrabold">{subject}</h3>
								<p className="text-sm text-primary-700">{subjectDescription}</p>
							</div>
						</div>
					</div>
				</div>
				<div className="mt-5">
					<h1 className="font-bold">{title}</h1>
					<p className="text-sm text-gray-600">{description}</p>
				</div>
			</CardBody>
			<Divider />
			<CardFooter className="justify-between">
				<Button endContent={<ChevronRight className="w-5 h-5" />} variant="bordered">
					Learn More
				</Button>
				<Button color="primary" as={Link} href={href}>
					{btnText}
				</Button>
			</CardFooter>
		</Card>
	);
};

export default WelcomeScreen;
