"use client";
import AuthRedirectComponent from "@/components/auth/AuthRedirectComponent";
import AppInput from "@/components/forms/AppInput";
import useDidHydrate from "@/hooks/useDidHydrate";
import { AppEnumRoutes } from "@/types/AppEnumRoutes";
import { SystemRole } from "@/types/User";
import { Avatar, BreadcrumbItem, Breadcrumbs, Button, Card, CardBody, CardFooter, CardHeader, Chip, Divider, Tab, Tabs } from "@nextui-org/react";
import { format } from "date-fns";
import { CheckCircleIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import { useMemo } from "react";
import { FiEdit } from "react-icons/fi";

const MyProfile = () => {
	const { didHydrate } = useDidHydrate();
	const { data: session, status } = useSession();

	const account = useMemo(() => {
		if (didHydrate && status === "authenticated") {
			return session?.user;
		}

		return null;
	}, [session, didHydrate]);

	return (
		<AuthRedirectComponent>
			<Breadcrumbs>
				<BreadcrumbItem href={AppEnumRoutes.APP_DASHBOARD}>Settings</BreadcrumbItem>
				<BreadcrumbItem>My Profile</BreadcrumbItem>
			</Breadcrumbs>
			<div className="my-5">
				<h1 className="font-bold text-2xl">My Profile</h1>
				<p className="text-gray-700">Manage your details view your tier status and change your password</p>
			</div>
			<div className="my-2">
				<div className="grid grid-cols-1 md:grid-cols-10 gap-x-4">
					<div className="col-auto md:col-span-3">
						<Card className="bg-green-50 px-3">
							<CardHeader className="justify-end">
								<Chip size="sm" color="success" variant="flat">
									<div className="flex items-center space-x-1">
										<p>{account?.accountStatus ? account.accountStatus : "Active"}</p> <CheckCircleIcon className="w-3 h-3" />
									</div>
								</Chip>
							</CardHeader>
							<CardBody>
								<div className="flex items-center justify-center">
									<Avatar src="https://i.pravatar.cc/150?u=a04258114e29026708c" className="w-32 h-32 text-large" />
								</div>
								<div className="my-3 text-center">
									<h1 className="text-xl font-bold">{account?.name ?? "None"}</h1>
									<h2>{account?.email ?? "None"}</h2>
								</div>
								<Divider />
								<div className="my-4 space-y-4 text-gray-700">
									<div className="flex items-center justify-between">
										<p>Membership Date</p>
										<p>{format(new Date(account?.createdAt ?? new Date()), "dd MMM, yyyy")}</p>
									</div>
									<div className="flex items-center justify-between">
										<p>Pro Registration End Date</p>
										<p>34 Days</p>
									</div>
									<div className="flex items-center justify-between">
										<p>Company Role</p>
										<p>{account?.roleInCompany ? account.roleInCompany : "None"}</p>
									</div>
									<div className="flex items-center justify-between">
										<p>Membership Duration</p>

										<Chip size="sm">1 Year</Chip>
									</div>
								</div>
							</CardBody>
						</Card>
					</div>
					<div className="col-auto md:col-span-7">
						<Tabs aria-label="My Profile" color="primary" variant="underlined">
							<Tab key={"profile-info"} title={<p className="font-medium">Profile Information</p>}>
								<Card className="bg-gray-100 shadow-sm border py-5 px-3">
									<CardHeader>General Information</CardHeader>
									<CardBody>
										<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
											<AppInput label="Name" value={account?.name ?? "None"} />
											<AppInput label="Role In Company" value={account?.systemRole === SystemRole.COMPANY_ADMIN ? "Admin" : "User"} />
											<AppInput label="Email" value={account?.email ?? "None"} />
											<AppInput label="Phone No" value="0700123456" />
											<AppInput label="Password" value="********" />
										</div>
									</CardBody>
									<CardFooter>
										<Button color="primary" endContent={<FiEdit />}>
											Update Profile
										</Button>
									</CardFooter>
								</Card>
							</Tab>
							<Tab key={"settings"} title="Account Settings">
								<Card className="shadow-sm px-3 py-4 bg-gray-100 border">
									<CardBody>
										<div className="space-y-4 my-2">
											<h3 className="text-sm font-semibold ">Deactivate Account</h3>
											<p className="text-[14px] md:w-[85%]">
												Deactivating your account is a permanent action, rendering it inaccessible. Prior to confirming, ensure you've saved any essential information. Once deactivated, contact
												our support team for assistance or reactivation inquiries
											</p>
											<Button color="danger" variant="bordered">
												Deactivate
											</Button>
											<Divider />
										</div>
										<div className="space-y-4 my-2">
											<h3 className="text-sm font-semibold ">Delete Account</h3>
											<p className="text-[14px] md:w-[85%]">
												Deleting your account is a permanent action, removing all data. Please review and download any important information before confirming. Once completed, your account will be
												deactivated immediately. For assistance, contact our support team.
											</p>
											<Button color="danger" variant="bordered">
												Delete
											</Button>
											<Divider />
										</div>
									</CardBody>
								</Card>
							</Tab>
							<Tab key={"subscription"} title="Subscription"></Tab>
						</Tabs>
					</div>
				</div>
			</div>
		</AuthRedirectComponent>
	);
};

export default MyProfile;
