import AuthRedirectComponent from "@/components/auth/AuthRedirectComponent";
import ProfileSectionContainer from "@/components/sections/ProfileSectionContainer";
import AppLayout from "@/layouts/AppLayout";
import { swrFetcher } from "@/lib/api-client";
import { IApiEndpoint } from "@/types/Api";
import { AppEnumRoutes } from "@/types/AppEnumRoutes";
import { NextPageWithLayout } from "@/types/Layout";
import { IUser } from "@/types/User";
import { capitalize } from "@/utils";
import { BreadcrumbItem, Breadcrumbs, Card, CardBody, Divider, Input, Spinner } from "@nextui-org/react";
import { format } from "date-fns";
import { UsersIcon, User as ProfileIcon } from "lucide-react";
import { useRouter } from "next/router";
import useSWR from "swr";

const UserProfile: NextPageWithLayout = () => {
	const router = useRouter();
	const { id } = router.query as { id: string };

	const {
		data: userInfo,
		isLoading,
		error: _,
		mutate,
	} = useSWR<IUser>([IApiEndpoint.USER_PROFILE, { id }], swrFetcher, {
		keepPreviousData: true,
	});
	return (
		<AuthRedirectComponent>
			<Breadcrumbs>
				<BreadcrumbItem startContent={<UsersIcon size={16} />} href={AppEnumRoutes.APP_USERS}>
					Users
				</BreadcrumbItem>
				<BreadcrumbItem startContent={<ProfileIcon size={16} />}>Profile</BreadcrumbItem>
			</Breadcrumbs>
			<div className="relative mt-8">
				<div className="rounded-2xl bg-gradient-to-r from-primary-400 via-primary-grey to-primary-brown w-full h-56"></div>
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
							<ProfileSectionContainer title="Actions" subtitle="Actions that can be performed on this user">
								<div className="flex flex-col space-y-3">
                                    {/* TODO: Add ability to company admin */}
									{/* <UpdateUserCompanyModal currentCompany={userInfo?.company} userId={userInfo?.id} />
									<UpdateUserToAdminModal account={userInfo} refresh={mutate} />
									<SuspendActivateAccount account={userInfo} refresh={mutate} /> */}
								</div>
							</ProfileSectionContainer>
						</div>
					</CardBody>
				</Card>
			)}
		</AuthRedirectComponent>
	);
};

UserProfile.getLayout = (page) => <AppLayout>{page}</AppLayout>;

export default UserProfile;
