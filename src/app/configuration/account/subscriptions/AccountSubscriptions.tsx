"use client";
import AuthRedirectComponent from "@/components/auth/AuthRedirectComponent";
import AppTable, { IAppTableColumn } from "@/components/table/AppTable";
import useDidHydrate from "@/hooks/useDidHydrate";
import useSubscriptionUtils from "@/hooks/useSubscriptionUtils";
import { swrFetcher } from "@/lib/api-client";
import { IApiEndpoint } from "@/types/Api";
import { ICompany } from "@/types/Company";
import { AppKey } from "@/types/Global";
import { IStripeProductPrice, ISubscription } from "@/types/Subscription";
import { formatCurrencyBilling } from "@/utils";
import { Alert, BreadcrumbItem, Breadcrumbs, Button, Card, CardBody, CardFooter, CardHeader, Chip, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Link, Skeleton, Tab, Tabs } from "@heroui/react";
import { SettingsIcon, TrashIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { LuMoreVertical } from "react-icons/lu";
import useSWR from "swr";

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

const headerColumns: IAppTableColumn[] = [
	{
		name: "Plan",
		uid: "plan",
	},
	{
		name: "Price",
		uid: "price",
	},
	{
		name: "Status",
		uid: "status",
	},
	{
		name: "Actions",
		uid: "actions",
	},
];

const getProductTitleDescription = (name: string) => {
	const title = name.split(":")[0];
	const desc = name.split(":")[1];
	return { title, desc };
};

const getProductPrice = (price: string | number) => {
	return Number(price) / 100;
};

const AccountSubscriptions = () => {
	const [loading, setLoading] = useState<boolean>(false);
	const [successCheckout, setSuccessCheckout] = useState<boolean>(false);
	const [checkoutSessionId, setCheckoutSessionId] = useState<string>("");
	const [showAlert, setShowAlert] = useState<boolean>(false);

	const { createStripeCustomer, createSubscriptionCheckoutSession, createPortalSession } = useSubscriptionUtils();
	const searchParams = useSearchParams();

	const { data: session, status } = useSession();
	const { didHydrate } = useDidHydrate();

	const userInfo = useMemo(() => {
		if (didHydrate && status === "authenticated") {
			return session?.user;
		}

		return null;
	}, [status, didHydrate]);

	const { data: companyInfo } = useSWR<ICompany>([IApiEndpoint.GET_COMPANY, { id: userInfo?.company?.id }], swrFetcher, { keepPreviousData: true });

	const setupPortalSession = async () => {
		const id = toast.loading("Setting up session");
		console.log('userInfo?.company?.stripeCustomerId', userInfo?.company?.stripeCustomerId)
		try {
			const resp = await createPortalSession(userInfo?.company?.stripeCustomerId);

			if (resp.status === "success") {
				const url = resp.data;
				const win: Window = window;
				win.location = url;
			} else {
				toast.error("Unable to setup portal session at the moment. Try again later.", { id });
			}
		} catch (err) {
			console.log("err900", err);
			toast.error("Unable to setup portal session at the moment. Try again later.", { id });
		}
	};

	const renderCell = useCallback((item: ISubscription, columnKey: AppKey) => {
		switch (columnKey) {
			case "plan":
				return <span>{item?.planName}</span>;
			case "price":
				return <span>{formatCurrencyBilling(Number(item.price))}</span>;
			case "status":
				return (
					<span>
						<Chip color="primary">{item.status}</Chip>
					</span>
				);
			case "actions":
				return (
					<Dropdown>
						<DropdownTrigger>
							<Button variant="bordered" size="sm" isIconOnly color="primary">
								<LuMoreVertical />
							</Button>
						</DropdownTrigger>
						<DropdownMenu
							variant="faded"
							aria-label="Actions Menu"
							itemClasses={{
								base: [
									"rounded-md",
									"text-default-500",
									"transition-opacity",
									"data-[hover=true]:text-foreground",
									"data-[hover=true]:bg-default-100",
									"dark:data-[hover=true]:bg-default-50",
									"data-[selectable=true]:focus:bg-default-50",
									"data-[pressed=true]:opacity-70",
									"data-[focus-visible=true]:ring-default-500",
								],
							}}>
							<DropdownItem key={"manage"} startContent={<SettingsIcon size={16} />} onPress={setupPortalSession}>
								Manage Subscription Information
							</DropdownItem>
							{/* <DropdownItem key={"remove"} startContent={<TrashIcon size={16} />}>
								Unsubscribe from Subscription
							</DropdownItem> */}
						</DropdownMenu>
					</Dropdown>
				);
		}
	}, [userInfo]);

	const onClickSetupSubscription = async (lookup_key: string) => {
		let stripeCustomerId: string | null = companyInfo?.stripeCustomerId;
		const id = toast.loading("Processing Subscription ...");
		if (!stripeCustomerId) {
			try {
				setLoading(true);
				const resp = await createStripeCustomer(userInfo?.company?.id, userInfo?.id, userInfo?.email);

				if (resp?.status === "success") {
					stripeCustomerId = resp.data;
				} else {
					toast.error("Unable to process the subscription at this time.", { id });
				}
			} catch (err) {
				toast.error("Unable to process the subscription at this time.", { id });
			} finally {
				setLoading(false);
			}
		}

		if (stripeCustomerId) {
			try {
				// lookup_key = SaaStain_Basic-fe6a1be
				setLoading(true);
				const resp = await createSubscriptionCheckoutSession(lookup_key, stripeCustomerId);

				if (resp?.status === "success") {
					const url = resp.data;
					const win: Window = window;
					win.location = url;
				} else {
					toast.error(`Unable to setup checkout`, { id });
				}
			} catch (err) {
				toast.error(`Unable to setup checkout`, { id });
			} finally {
				setLoading(false);
			}
		}
	};

	useEffect(() => {
		if (searchParams.get("success")) {
			setSuccessCheckout(true);
			setCheckoutSessionId(searchParams.get("session_id"));
			setShowAlert(true);
			// if (activeTab === "my-plans") {
			// 	setActiveTab("setup-plan");
			// }
		}

		if (searchParams.get("canceled")) {
			setSuccessCheckout(false);
			setShowAlert(true);
		}
	}, [searchParams]);

	const { data: subscriptions, isLoading: loadingSubs } = useSWR<ISubscription[]>(!userInfo ? null : [`${IApiEndpoint.SUBSCRIPTIONS_BY_COMPANY}/${userInfo?.company?.id}`], swrFetcher, { keepPreviousData: true });

	const { data: products, isLoading: loadingProducts } = useSWR<IStripeProductPrice[]>([IApiEndpoint.SUBSCRIPTIONS_GET_STRIPE_PRODUCTS], swrFetcher, { keepPreviousData: true });

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
				{successCheckout && checkoutSessionId && showAlert && (
					<div className="w-full">
						<Alert color="success" variant="faded" title={"Success"} description={"You have successfully subscribed to the Basic Plan"} isVisible={showAlert} onClose={() => setShowAlert(false)} />
					</div>
				)}
				{!successCheckout && searchParams.get("canceled") && showAlert && (
					<div className="w-full">
						<Alert color="warning" title={"Checkout Cancelled"} description={"Checkout Canceled for the order. Please try again."} isVisible={showAlert} onClose={() => setShowAlert(false)} />
					</div>
				)}
				<div className="mt-6">
					<Tabs aria-label="Account Subscriptions" color="primary" variant="underlined">
						<Tab key={"my-plans"} title={"My Plans"}>
							<h1>My Plans</h1>
							<div className="mt-5">
								<AppTable<ISubscription> title={"Plans"} data={subscriptions ?? []} headerColumns={headerColumns} count={subscriptions?.length ?? 0} isLoading={loadingSubs} renderCell={renderCell} />
							</div>
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
									{loadingProducts && !products && [...Array.from({ length: 3 })].map((_, idx) => <PricingSkeleton key={idx} />)}
									{products && products?.length && (
										<>
											<div className="col-auto md:col-span-3">
												<h1 className="text-2xl md:text-5xl font-bold pt-3 text-center md:text-start">Choose a plan that's right for you</h1>
											</div>
											{products.map((item, idx) => (
												<div className="col-auto md:col-span-3" key={idx}>
													<PricingCard
														title={getProductTitleDescription(item.product.name).title}
														subtitle={getProductTitleDescription(item.product.name).desc}
														subtitlePreText={getProductTitleDescription(item.product.name).title.toLowerCase() === "basic" ? "Start with" : "Upgrade to"}
														description={item.product.description}
														monthlyAmt={getProductPrice(item.unit_amount).toString()}
														annualAmt={(getProductPrice(item.unit_amount) * 10).toString()}
														btnText={getProductTitleDescription(item.product.name).title.toLowerCase() === "basic" ? "Get Started" : "Upgrade"}
														onBtnClick={() => onClickSetupSubscription(item.lookup_key)}
														isBtnLoading={loading}
													/>
												</div>
											))}
										</>
									)}
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

const PricingSkeleton = () => {
	return (
		<Card className="space-y-5 p-4 min-h-[260px]">
			<Skeleton className="rounded-lg">
				<div className="h-24 rounded-lg bg-secondary" />
			</Skeleton>
			<div className="space-y-3">
				<Skeleton className="w-3/5 rounded-lg">
					<div className="h-3 w-full rounded-lg bg-secondary" />
				</Skeleton>
				<Skeleton className="w-4/5 rounded-lg">
					<div className="h-3 w-full rounded-lg bg-secondary-300" />
				</Skeleton>
				<Skeleton className="w-2/5 rounded-lg">
					<div className="h-3 w-full rounded-lg bg-secondary-200" />
				</Skeleton>
			</div>
		</Card>
	);
};

export default AccountSubscriptions;
