"use client";
import AuthRedirectComponent from "@/components/auth/AuthRedirectComponent";
import RemoveUserAccount from "@/components/modals/RemoveUserAccount";
import SuspendActivateAccount from "@/components/modals/SuspendActivateAccount";
import UpdateUserCompanyModal from "@/components/modals/UpdateUserCompanyModal";
import UpdateUserToAdminModal from "@/components/modals/UpdateUserToAdminModal";
import ProfileSectionContainer from "@/components/sections/ProfileSectionContainer";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { swrFetcher } from "@/lib/api-client";
import { IApiEndpoint } from "@/types/Api";
import { AppEnumRoutes } from "@/types/AppEnumRoutes";
import { AccountStatus, IUser } from "@/types/User";
import { capitalize } from "@/utils";
import { BreadcrumbItem, Breadcrumbs, Divider, Input, Spinner } from "@heroui/react";
import { format } from "date-fns";
import { Home, UsersIcon, User as ProfileIcon, AlertTriangleIcon } from "lucide-react";
import useSWR from "swr";

interface UserProfileProps {
	id: string;
}

const UserProfile = ({ id }: UserProfileProps) => {
	const {
		data: userInfo,
		isLoading,
		error,
		mutate,
	} = useSWR<IUser>([IApiEndpoint.USER_PROFILE, { id }], swrFetcher, {
		keepPreviousData: true,
	});

	return (
		<AuthRedirectComponent>
			<Breadcrumbs>
				<BreadcrumbItem startContent={<Home size={16} />} href={AppEnumRoutes.APP_DASHBOARD}>
					Home
				</BreadcrumbItem>
				<BreadcrumbItem startContent={<UsersIcon size={16} />} href={AppEnumRoutes.APP_USERS}>
					Users
				</BreadcrumbItem>
				<BreadcrumbItem startContent={<ProfileIcon size={16} />}>Profile</BreadcrumbItem>
			</Breadcrumbs>
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
			{error && (
				<Alert variant="destructive">
					<AlertTriangleIcon className="h-4 w-4" />
					<AlertTitle>Error</AlertTitle>
					<AlertDescription>
						<p>There was an error fetching the user details. Please try again later.</p>
					</AlertDescription>
				</Alert>
			)}
			{userInfo && (
				<>
					{userInfo?.accountStatus !== AccountStatus.ACTIVE && (
						<div className="mt-16">
							<Alert variant="destructive">
								<AlertTriangleIcon className="h-4 w-4" />
								<AlertTitle>User Account Action</AlertTitle>
								<AlertDescription>
									<div className="flex items-center gap-2">
										<p>
											This user's account has been <span className="font-semibold text-danger">{userInfo?.accountStatus}</span> and can be activated by clicking
										</p>
										<SuspendActivateAccount account={userInfo} refresh={mutate} />
									</div>
								</AlertDescription>
							</Alert>
						</div>
					)}
					<div className="bg-white shadow-lg rounded-xl px-3 py-5 mt-16 border">
						<div className="flex flex-col md:flex-row items-center justify-center md:justify-between md:mb-0">
							<h3 className="text-lg font-semibold">Profile</h3>
						</div>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-5 my-6">
							<Input label={"Name"} value={userInfo?.name} isReadOnly />
							<Input label={"Email"} value={userInfo?.email} isReadOnly />
							<Input label={"Email Verification"} value={userInfo?.isEmailVerified ? "Yes" : "No"} isReadOnly />
							<Input label={"Account Status"} value={capitalize(String(userInfo?.accountStatus))} isReadOnly />
							<Input label={"System Role"} value={capitalize(String(userInfo?.systemRole)?.split("_").join(" "))} isReadOnly />
							<Input label={"Onboarded On"} value={format(new Date(userInfo?.createdAt as string), "yyyy-MM-dd HH:mm") ?? "None"} isReadOnly />
							<Input label={"Updated At"} value={format(new Date(userInfo?.updatedAt as string), "yyyy-MM-dd HH:mm") ?? "None"} isReadOnly />
						</div>
						<Divider />
						<div className="my-6">
							{userInfo?.accountStatus === AccountStatus.ACTIVE && (
								<ProfileSectionContainer title="Actions" subtitle="Actions that can be performed on this user">
									<div className="flex flex-col space-y-3">
										<UpdateUserCompanyModal currentCompany={userInfo?.company} userId={userInfo?.id} />
										<UpdateUserToAdminModal account={userInfo} refresh={mutate} />
										<SuspendActivateAccount account={userInfo} refresh={mutate} />
										<RemoveUserAccount account={userInfo} mutate={mutate} />
									</div>
								</ProfileSectionContainer>
							)}
						</div>
					</div>
				</>
			)}
		</AuthRedirectComponent>
	);
};

export default UserProfile;
