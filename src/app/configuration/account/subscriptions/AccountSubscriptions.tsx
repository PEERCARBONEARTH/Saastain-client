"use client";
import AuthRedirectComponent from "@/components/auth/AuthRedirectComponent";
import useSubscriptionUtils from "@/hooks/useSubscriptionUtils";
import { BreadcrumbItem, Breadcrumbs, Button, Card, CardBody, CardFooter, CardHeader, Link, Tab, Tabs } from "@nextui-org/react";
import { useState } from "react";
import toast from "react-hot-toast";

interface PricingCardProps {
	title: string;
	subtitle: string;
	subtitlePreText: string;
	description: string;
	monthlyAmt: string;
	annualAmt: string;
	btnText: string;
	onBtnClick?: () => void;
	isBtnLoading?: boolean;
}

const AccountSubscriptions = () => {
	const { createCheckoutSession } = useSubscriptionUtils();

	const [loading, setLoading] = useState<boolean>(false);

	const onClickSubscribe = async () => {
		setLoading(true);
		try {
			const resp = await createCheckoutSession("SaaStain_Basic-fe6a1be");

			if (resp.status === "success") {
				window.location = resp.data.url;
			} else {
				toast("Unable to setup checkout session at the moment");
			}
		} catch (err) {
			console.log("err00", err);
			toast("Unable to setup checkout session at the moment");
		} finally {
			setLoading(false);
		}
	};
	return (
		<AuthRedirectComponent>
			<Breadcrumbs>
				<BreadcrumbItem>Configuration</BreadcrumbItem>
				<BreadcrumbItem>Subscriptions</BreadcrumbItem>
			</Breadcrumbs>
			<div className="mt-4">
				<h1 className="text-2xl font-bold text-primary-800">Subscriptions</h1>
				<div className="mt-2">
					<hr className="border-saastain-gray border-1" />
				</div>
				<div className="mt-6 space-y-2">
					<h2 className="text-lg font-semibold text-primary-800">Manage your Subscriptions</h2>
					<p className="text-sm text-gray-600 w-full md:w-[80%]">In this section you can be able to configure your subscriptions for your organization in order to track your emissions easily.</p>
				</div>
				<div className="mt-6">
					<Tabs aria-label="Account Subscriptions" color="primary" variant="underlined">
						<Tab key={"my-plans"} title={"My Plans"}>
							<h1>My Plans</h1>
						</Tab>
						<Tab key={"setup-plan"} title={"Setup New Plan"}>
							<div className="flex items-center justify-between">
								<h1 className="text-lg font-semibold">Setup New Plan</h1>
								<Button color="primary" as={Link} href="/pricing" target="_blank">
									More Info About Plans
								</Button>
							</div>
							<div className="mt-5">
								<div className="grid grid-cols-1 md:grid-cols-9 gap-5">
									<div className="col-auto md:col-span-3">
										<h1 className="text-2xl md:text-5xl font-bold pt-3 text-center md:text-start">Choose a plan that's right for you</h1>
									</div>
									<div className="col-auto md:col-span-3">
										<PricingCard
											title="Basic"
											subtitle="GHG Report Compliance"
											subtitlePreText="Start with"
											description="Your company only needs an auditable GHG Report."
											monthlyAmt="52"
											annualAmt="520"
											btnText="Get Started"
											onBtnClick={onClickSubscribe}
											isBtnLoading={loading}
										/>
									</div>
									<div className="col-auto md:col-span-3">
										<PricingCard
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
							</div>
						</Tab>
					</Tabs>
				</div>
			</div>
		</AuthRedirectComponent>
	);
};

const PricingCard = ({ title, subtitle, subtitlePreText, description, monthlyAmt, annualAmt, btnText, onBtnClick, isBtnLoading }: PricingCardProps) => {
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
				<Button color="primary" className="w-full" onPress={onBtnClick} isLoading={isBtnLoading} isDisabled={isBtnLoading}>
					{btnText}
				</Button>
			</CardFooter>
		</Card>
	);
};

export default AccountSubscriptions;
