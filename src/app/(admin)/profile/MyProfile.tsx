"use client"
import AuthRedirectComponent from "@/components/auth/AuthRedirectComponent";
import RefreshBtn from "@/components/btns/RefreshBtn";
import useDidHydrate from "@/hooks/useDidHydrate";
import { swrFetcher } from "@/lib/api-client";
import { IApiEndpoint } from "@/types/Api";
import { AppEnumRoutes } from "@/types/AppEnumRoutes";
import { IUser } from "@/types/User";
import { capitalize, formatDateTime } from "@/utils";
import { BreadcrumbItem, Breadcrumbs, Card, CardBody, Divider, Input, Spinner } from "@nextui-org/react";
import { Home, UserIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import { useMemo } from "react";
import useSWR from "swr";

const MyProfile = () => {
	const { data: session } = useSession();
	const { didHydrate } = useDidHydrate();

	const account = useMemo(() => {
		if (didHydrate) {
			return session?.user;
		}

		return null;
	}, [session, didHydrate]);

	const { data: userInfo, isLoading, error: _, mutate: refresh } = useSWR<IUser>([IApiEndpoint.USER_PROFILE, { id: account?.id }], swrFetcher, { keepPreviousData: true });
	return (
		<AuthRedirectComponent>
			<div className="flex items-center justify-between">
				<Breadcrumbs>
					<BreadcrumbItem startContent={<Home size={16} />} href={AppEnumRoutes.APP_DASHBOARD}>
						Home
					</BreadcrumbItem>
					<BreadcrumbItem startContent={<UserIcon size={16} />}>My Profile</BreadcrumbItem>
				</Breadcrumbs>
				<RefreshBtn isLoading={isLoading} refetch={refresh} />
			</div>
			<div className="relative mt-8">
				<div className="rounded-2xl bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 w-full h-56"></div>
				<div className="absolute -bottom-10 left-5 ">
					<img src="https://i.pravatar.cc/150?u=a042581f4e29026704d" className="rounded-full w-24 h-24" />
				</div>
			</div>
			{isLoading && (
				<div className="flex items-center justify-center h-96">
					<Spinner size="lg" /> <span className="ml-2">Loading...</span>
				</div>
			)}

			{userInfo && (
				<Card
					classNames={{
						base: "mt-16",
					}}>
					<CardBody>
						<div className="flex flex-col md:flex-row items-center justify-center md:justify-between md:mb-0">
							<h3 className="text-lg font-semibold">My Profile</h3>
						</div>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-5 my-6">
							<Input label={"Name"} value={userInfo?.name} isReadOnly />
							<Input label={"Email"} value={userInfo?.email} isReadOnly />
							<Input label={"Email Verification"} value={userInfo?.isEmailVerified ? "Yes" : "No"} isReadOnly />
							<Input label={"Account Status"} value={capitalize(String(userInfo?.accountStatus))} isReadOnly />
							<Input label={"System Role"} value={capitalize(String(userInfo?.systemRole)?.split("_").join(" "))} isReadOnly />
							<Input label={"Onboarded On"} value={formatDateTime(userInfo?.createdAt) ?? "None"} isReadOnly />
							<Input label={"Updated At"} value={formatDateTime(userInfo?.updatedAt) ?? "None"} isReadOnly />
						</div>
						<Divider />
					</CardBody>
				</Card>
			)}
		</AuthRedirectComponent>
	);
};

export default MyProfile;
