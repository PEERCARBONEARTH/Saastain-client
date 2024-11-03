"use client";
import AuthRedirectComponent from "@/components/auth/AuthRedirectComponent";
import AppInput from "@/components/forms/AppInput";
import { API_URL } from "@/env";
import useDidHydrate from "@/hooks/useDidHydrate";
import useUserUtils from "@/hooks/useUserUtils";
import { IApiResponse } from "@/types/Api";
import { AppEnumRoutes } from "@/types/AppEnumRoutes";
import { IUser, SystemRole } from "@/types/User";
import { zodResolver } from "@hookform/resolvers/zod";
import { Avatar, BreadcrumbItem, Breadcrumbs, Button, Card, CardBody, CardFooter, CardHeader, Chip, Divider, Tab, Tabs, Tooltip } from "@nextui-org/react";
import axios, { AxiosRequestConfig } from "axios";
import { format } from "date-fns";
import { CheckCircleIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { FiEdit, FiEdit3 } from "react-icons/fi";
import { z } from "zod";

//https://i.pravatar.cc/150?u=a04258114e29026708c

const formSchema = z.object({
	name: z.string().min(1, "Your name is required"),
	roleInCompany: z.string().min(1, "Role In Company is required"),
	phoneNo: z.string(),
});

const MyProfile = () => {
	const { didHydrate } = useDidHydrate();
	const { data: session, status, update: updateSession } = useSession();
	const imagePickerRef = useRef<HTMLInputElement>(null);
	const [pickedImage, setPickedImage] = useState<ArrayBuffer | string>(null);
	const [pickedImageData, setPickedImageData] = useState<File>(null);
	const [loading, setLoading] = useState<boolean>(false);

	const { updateUserProfile } = useUserUtils();

	const account = useMemo(() => {
		if (didHydrate && status === "authenticated") {
			return session?.user;
		}

		return null;
	}, [session, didHydrate]);

	const formMethods = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: "",
			roleInCompany: "",
			phoneNo: "",
		},
	});

	const {
		handleSubmit,
		formState: { errors: formErrors },
		control,
		setValue,
	} = formMethods;

	const handlePickImage = (event: ChangeEvent<HTMLInputElement>) => {
		if (event.target.files && event.target.files.length > 0) {
			const file = event.target.files[0];
			const reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onloadend = () => {
				if (!reader.result) return;

				setPickedImage(reader.result);
				setPickedImageData(file);
				uploadImage(file);
			};
		}
	};

	const uploadImage = async (file: File) => {
		const formData = new FormData();
		formData.append("file", file);
		formData.append("folder", `profiles/${account?.id}`);
		let config = {
			method: "post",
			maxBodyLength: Infinity,
			url: `${API_URL}/uploads/single`,
			headers: {
				Authorization: account?.token,
			},
			data: formData,
		} satisfies AxiosRequestConfig;

		const id = toast.loading("Uploading ...");

		try {
			const rawResp = await axios.request<IApiResponse<string>>(config);

			const respData = rawResp.data;

			if (respData?.status === "success") {
				setPickedImage(respData?.data);
				toast.success("Profile Pic Uploaded", { id });
			} else {
				toast.error("Unable to upload image at the moment", { id });
			}
		} catch (err) {
			toast.error("Unable to upload image at the moment", { id });
		}
	};

	const updateSessionData = async (data: Pick<IUser, "name" | "phoneNo" | "roleInCompany" | "profilePicture">) => {
		try {
			await updateSession({ user: { ...session?.user, ...data } });
		} catch (err) {}
	};

	const onSubmit = handleSubmit(async (data: Required<z.infer<typeof formSchema>>) => {
		let info = {
			...data,
			profilePicture: pickedImage as string,
			userId: account?.id,
		};

		setLoading(true);

		try {
			const resp = await updateUserProfile(info);

			if (resp?.status === "success") {
				toast.success("Your profile updated successfully");
				let { userId, ...sessionInfo } = info;
				updateSessionData(sessionInfo);
			} else {
				toast.error("Unable to update your profile at the moment");
			}
		} catch (err) {
			toast.error("Unable to update your profile at the moment");
		} finally {
			setLoading(false);
		}
	});

	useEffect(() => {
		if (account) {
			setValue("name", account?.name);
			setValue("phoneNo", account?.phoneNo);
			setValue("roleInCompany", account?.roleInCompany);
			if (account?.profilePicture) {
				setPickedImage(account?.profilePicture);
			}
		}
	}, [account]);

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
									<div className="relative">
										<Avatar src={pickedImage as string} className="w-32 h-32 text-large" />
										<div className="absolute right-2 bottom-1">
											<Tooltip content={"Update Profile Image"}>
												<Button onPress={() => imagePickerRef && imagePickerRef?.current?.click?.()} className="rounded-full" color="primary" size="sm" isIconOnly>
													<FiEdit3 />
												</Button>
											</Tooltip>
											<input type="file" ref={imagePickerRef} accept="image/*" hidden onChange={handlePickImage} />
										</div>
									</div>
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

										<Chip size="sm">None</Chip>
									</div>
								</div>
							</CardBody>
						</Card>
					</div>
					<div className="col-auto md:col-span-7">
						<Tabs aria-label="My Profile" color="primary" variant="underlined">
							<Tab key={"profile-info"} title={<p className="font-medium">Profile Information</p>}>
								<FormProvider {...formMethods}>
									<form onSubmit={onSubmit}>
										<Card className="bg-gray-100 shadow-sm border py-5 px-3">
											<CardHeader>General Information</CardHeader>
											<CardBody>
												<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
													<AppInput labelPlacement="inside" name="name" control={control} error={formErrors.name} label="Name" />
													<AppInput labelPlacement="inside" name="roleInCompany" control={control} error={formErrors.roleInCompany} label="Role In Company" placeholder="e.g. Data Entry" />
													{/* <AppInput label="Email" value={account?.email ?? "None"} /> */}
													<AppInput labelPlacement="inside" name="phoneNo" control={control} error={formErrors.phoneNo} label="Phone No" placeholder="e.g. 0700123456" />
													{/* <AppInput label="Password" value="********" /> */}
												</div>
											</CardBody>
											<CardFooter>
												<Button isLoading={loading} isDisabled={loading} type="submit" color="primary" endContent={<FiEdit />}>
													Update Profile
												</Button>
											</CardFooter>
										</Card>
									</form>
								</FormProvider>
							</Tab>
							<Tab key={"settings"} title="Account Settings">
								<Card className="shadow-sm px-3 py-4 bg-gray-100 border">
									<CardBody>
										<div className="space-y-4 my-2">
											<h3 className="text-sm font-semibold ">Change Password</h3>
											<p className="text-[14px] md:w-[85%]">
												To change your password, please enter your current password followed by your new password. Ensure that your new password is strong and unique. If you forget your password,
												you can reset it using the email associated with your account.
											</p>
											<Button color="primary" variant="bordered">
												Update
											</Button>
											<Divider />
										</div>
										<div className="space-y-4 my-2">
											<h3 className="text-sm font-semibold ">Deactivate Account</h3>
											<p className="text-[14px] md:w-[85%]">
												Deactivating your account is a permanent action, rendering it inaccessible. Prior to confirming, ensure you've saved any essential information. Once deactivated, contact
												our support team for assistance or reactivation inquiries
											</p>
											<Button color="warning" variant="bordered">
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
