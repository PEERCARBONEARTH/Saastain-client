"use client";
import { Accordion, AccordionItem, Button, Card, CardBody, CardFooter, CardHeader } from "@nextui-org/react";
import { CheckIcon, InfoIcon, XIcon } from "lucide-react";

interface DesktopPricingCardProps {
	title: string;
	subtitle: string;
	subtitlePreText: string;
	description: string;
	monthlyAmt: string;
	annualAmt: string;
	btnText: string;
}

const PricingScreen = () => {
	return (
		<>
			<div className="hidden md:grid grid-cols-9 gap-5">
				<div className="col-span-3">
					<h1 className="text-5xl font-bold pt-3">Choose a plan that's right for you</h1>
				</div>
				<div className="col-span-3">
					<DesktopPricingCard
						title="Basic"
						subtitle="GHG Report Compliance"
						subtitlePreText="Start with"
						description="Your company only needs an auditable GHG Report."
						monthlyAmt="52"
						annualAmt="520"
						btnText="Get Started"
					/>
				</div>
				<div className="col-span-3">
					<DesktopPricingCard
						title="Pro"
						subtitle="Climate Action Ready"
						subtitlePreText="Upgrade to"
						description="Your company wants to launch a climate strategy with advanced precision analysis."
						monthlyAmt="80"
						annualAmt="800"
						btnText="Upgrade"
					/>
				</div>
			</div>
			<div className="hidden md:grid grid-cols-9 gap-5 mt-20">
				<div className="col-span-3">
					<h2 className="text-2xl font-semibold mb-2">Compare Plans</h2>
					<hr className="border-gray-400" />
					<div className="my-3 space-y-3">
						<h3 className="font-bold">Carbon Assessment</h3>
						<p className="text-sm">Scope 1 & 2 activity modules</p>
					</div>
					<hr className="border-gray-400" />
					<div className="my-3 space-y-3">
						<h3 className="font-bold">Climate Strategy</h3>
						<p className="text-sm">Decarbonization best-practices</p>
						<p className="text-sm">Customized action plans</p>
					</div>
					<hr className="border-gray-400" />
					<div className="my-3 space-y-3">
						<h3 className="font-bold">Support</h3>
						<p className="text-sm">Online Support</p>
						<p className="text-sm">Dedicated Onboarding</p>
					</div>
					<hr className="border-gray-400" />
					<div className="my-3 space-y-3">
						<h3 className="font-bold">Security</h3>
						<p className="text-sm">SOC2 & ISO Certificate</p>
					</div>
					<hr className="border-gray-400" />
				</div>
				<div className="col-span-3">
					<h2 className="text-2xl font-semibold mb-2">GHG Report Compliance</h2>
					<hr className="border-gray-400" />
					<div className="my-3 space-y-3">
						<div className="pt-8 flex items-center justify-center">
							<CheckIcon />
						</div>
					</div>
					<hr className="border-gray-400" />
					<div className="my-3 space-y-3">
						<div className="pt-8 flex flex-col items-center justify-center gap-2">
							<CheckIcon />
							<XIcon />
						</div>
					</div>
					<hr className="border-gray-400" />
					<div className="my-3 space-y-3">
						<div className="pt-8 flex flex-col items-center justify-center gap-2">
							<CheckIcon />
							<XIcon />
						</div>
					</div>
					<hr className="border-gray-400" />
					<div className="my-3 space-y-3">
						<div className="pt-8 flex items-center justify-center">
							<CheckIcon />
						</div>
					</div>
					<hr className="border-gray-400" />
				</div>
				<div className="col-span-3">
					<h2 className="text-2xl font-semibold mb-2">Climate Action Ready</h2>
					<hr className="border-gray-400" />
					<div className="my-3 space-y-3">
						<div className="pt-8 flex items-center justify-center">
							<CheckIcon />
						</div>
					</div>
					<hr className="border-gray-400" />
					<div className="my-3 space-y-3">
						<div className="pt-8 flex flex-col items-center justify-center gap-2">
							<CheckIcon />
							<CheckIcon />
						</div>
					</div>
					<hr className="border-gray-400" />
					<div className="my-3 space-y-3">
						<div className="pt-8 flex flex-col items-center justify-center gap-2">
							<CheckIcon />
							<CheckIcon />
						</div>
					</div>
					<hr className="border-gray-400" />
					<div className="my-3 space-y-3">
						<div className="pt-8 flex items-center justify-center">
							<CheckIcon />
						</div>
					</div>
					<hr className="border-gray-400" />
				</div>
			</div>
			<div className="block md:hidden">
				<h1 className="font-bold text-center text-xl">Choose a plan that's right for you</h1>
				<div className="mt-5">
					<Accordion variant="splitted" defaultExpandedKeys={["1"]}>
						<AccordionItem
							key={"1"}
							aria-label="GHG Report Compliance"
							title={"Basic: GHG Report Compliance"}
							subtitle={"Your company only needs an auditable GHG Report."}
							classNames={{ heading: "bg-white", subtitle: "text-gray-800", content: "bg-white" }}>
							<hr className="border-gray-500" />
							<div className="flex flex-col items-center justify-center gap-5 mt-5">
								<h1 className="font-semibold text-3xl">
									$52<span className="text-base">/month</span>{" "}
								</h1>
								<Button color="primary">Get Started</Button>
							</div>
							<div className="mt-5 space-y-3">
								<div className="flex items-center justify-between">
									<h3 className="font-bold">Carbon Assessment</h3>
									<InfoIcon />
								</div>
								<div className="flex items-center justify-between">
									<p className="text-sm">Scope 1 & 2 activity modules</p>
									<CheckIcon />
								</div>
								<hr className="border-gray-500" />
							</div>
							<div className="mt-5 space-y-3">
								<div className="flex items-center justify-between">
									<h3 className="font-bold">Climate Strategy</h3>
									<InfoIcon />
								</div>
								<div className="flex items-center justify-between">
									<p className="text-sm">Decarbonization best-practices</p>
									<CheckIcon />
								</div>
								<div className="flex items-center justify-between">
									<p className="text-sm">Customized action plans</p>
									<XIcon />
								</div>
								<hr className="border-gray-500" />
							</div>
							<div className="mt-5 space-y-3">
								<div className="flex items-center justify-between">
									<h3 className="font-bold">Support</h3>
									<InfoIcon />
								</div>
								<div className="flex items-center justify-between">
									<p className="text-sm">Online Support</p>
									<CheckIcon />
								</div>
								<div className="flex items-center justify-between">
									<p className="text-sm">Dedicated Onboarding</p>
									<XIcon />
								</div>
								<hr className="border-gray-500" />
							</div>
							<div className="mt-5 space-y-3">
								<div className="flex items-center justify-between">
									<h3 className="font-bold">Security</h3>
									<InfoIcon />
								</div>
								<div className="flex items-center justify-between">
									<p className="text-sm">SOC2 & ISO Certificate</p>
									<CheckIcon />
								</div>
								<hr className="border-gray-500" />
							</div>
						</AccordionItem>
						<AccordionItem
							key={"2"}
							aria-label="Climate Action Ready"
							title={"Pro: Climate Action Ready"}
							subtitle={"Your company wants to launch a climate strategy with advanced precision analysis."}
							classNames={{ heading: "bg-white", subtitle: "text-gray-800", content: "bg-white" }}>
							<hr className="border-gray-500" />
							<div className="flex flex-col items-center justify-center gap-5 mt-5">
								<h1 className="font-semibold text-3xl">
									$80<span className="text-base">/month</span>{" "}
								</h1>
								<Button color="primary">Upgrade</Button>
							</div>
							<div className="mt-5 space-y-3">
								<div className="flex items-center justify-between">
									<h3 className="font-bold">Carbon Assessment</h3>
									<InfoIcon />
								</div>
								<div className="flex items-center justify-between">
									<p className="text-sm">Scope 1 & 2 activity modules</p>
									<CheckIcon />
								</div>
								<hr className="border-gray-500" />
							</div>
							<div className="mt-5 space-y-3">
								<div className="flex items-center justify-between">
									<h3 className="font-bold">Climate Strategy</h3>
									<InfoIcon />
								</div>
								<div className="flex items-center justify-between">
									<p className="text-sm">Decarbonization best-practices</p>
									<CheckIcon />
								</div>
								<div className="flex items-center justify-between">
									<p className="text-sm">Customized action plans</p>
									<CheckIcon />
								</div>
								<hr className="border-gray-500" />
							</div>
							<div className="mt-5 space-y-3">
								<div className="flex items-center justify-between">
									<h3 className="font-bold">Support</h3>
									<InfoIcon />
								</div>
								<div className="flex items-center justify-between">
									<p className="text-sm">Online Support</p>
									<CheckIcon />
								</div>
								<div className="flex items-center justify-between">
									<p className="text-sm">Dedicated Onboarding</p>
									<CheckIcon />
								</div>
								<hr className="border-gray-500" />
							</div>
							<div className="mt-5 space-y-3">
								<div className="flex items-center justify-between">
									<h3 className="font-bold">Security</h3>
									<InfoIcon />
								</div>
								<div className="flex items-center justify-between">
									<p className="text-sm">SOC2 & ISO Certificate</p>
									<CheckIcon />
								</div>
								<hr className="border-gray-500" />
							</div>
						</AccordionItem>
					</Accordion>
				</div>
			</div>
		</>
	);
};

const DesktopPricingCard = ({ title, subtitle, subtitlePreText, description, monthlyAmt, annualAmt, btnText }: DesktopPricingCardProps) => {
	return (
		<Card className="py-2 min-h-[260px] h-full">
			<CardHeader>
				<div className="flex flex-col">
					<h1 className="text-xl font-bold">{title}</h1>
					<h3 className="text-gray-600 text-sm">
						{subtitlePreText} <span className="font-bold">{subtitle}</span>
					</h3>
				</div>
			</CardHeader>
			<CardBody>
				<p className="mb-2 text-sm text-gray-700">{description}</p>
				<h1 className="text-primary font-semibold text-3xl">
					${monthlyAmt}
					<span className="text-base">/month</span>{" "}
				</h1>
				<p className="text-sm">Billed annually: ${annualAmt}</p>
			</CardBody>
			<CardFooter>
				<Button color="primary" className="w-full">
					{btnText}
				</Button>
			</CardFooter>
		</Card>
	);
};

export default PricingScreen;
