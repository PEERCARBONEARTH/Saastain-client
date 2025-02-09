"use client";
import AuthRedirectComponent from "@/components/auth/AuthRedirectComponent";
import AppInput from "@/components/forms/AppInput";
import AppRadioGroup from "@/components/forms/AppRadioGroup";
import useUserUtils from "@/hooks/useUserUtils";
import { AppEnumRoutes } from "@/types/AppEnumRoutes";
import { NewUserFormValues } from "@/types/Forms";
import { yupResolver } from "@hookform/resolvers/yup";
import { BreadcrumbItem, Breadcrumbs, Button, Card, CardBody } from "@heroui/react";
import { Home, UserPlus, UsersIcon } from "lucide-react";
import { nanoid } from "nanoid";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { object, string } from "yup";

const roles = [
	{
		label: "Admin",
		value: "admin",
	},
	{
		label: "Company Admin",
		value: "company_admin",
	},
	{
		label: "Guest",
		value: "guest",
	},
];

const FormSchema = object({
	name: string().required("Name is required"),
	email: string().required("Email is required").email("Email is invalid"),
	roleInCompany: string().required("Role in company is required"),
	systemRole: string().required("Select a system role for the user"),
});

const NewUser = () => {
	const formMethods = useForm({
		resolver: yupResolver(FormSchema),
		defaultValues: {
			name: "",
			email: "",
			roleInCompany: "",
			systemRole: "",
		},
	});
	const {
		handleSubmit,
		formState: { errors },
		reset,
		control,
	} = formMethods;
	const [loading, setLoading] = useState<boolean>(false);

	const { createUser } = useUserUtils();
	const router = useRouter();

	const onSubmit = async (data: NewUserFormValues) => {
		const userPassword = nanoid(10);
		const newData = {
			...data,
			password: userPassword,
		};
		setLoading(true);
		const id = toast.loading("Creating user...");
		try {
			const resp = await createUser(newData);
			if (resp?.status === "success") {
				toast.success("User created successfully", { id });
				reset();
				router.push(AppEnumRoutes.APP_USERS);
			} else {
				toast.error(resp?.msg ?? "Something went wrong", { id });
			}
		} catch (err) {
			toast.error(err?.message ?? "Something went wrong", { id });
		} finally {
			setLoading(false);
		}
	};

	return (
		<AuthRedirectComponent>
			<Breadcrumbs>
				<BreadcrumbItem startContent={<Home size={16} />} href={AppEnumRoutes.APP_DASHBOARD}>
					Home
				</BreadcrumbItem>
				<BreadcrumbItem startContent={<UsersIcon size={16} />} href={AppEnumRoutes.APP_USERS}>
					Users
				</BreadcrumbItem>
				<BreadcrumbItem startContent={<UserPlus size={16} />}>New User</BreadcrumbItem>
			</Breadcrumbs>
			<Card
				classNames={{
					base: "mt-16",
					body: "px-8 py-5",
				}}>
				<CardBody>
					<FormProvider {...formMethods}>
						<div className="flex flex-col md:flex-row items-center justify-center md:justify-between md:mb-0">
							<h3 className="text-lg font-semibold">Onboard New User</h3>
						</div>
						<form onSubmit={handleSubmit(onSubmit)}>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-8 my-6">
								<AppInput name="name" label="Name" placeholder="e.g. John Kelly" control={control} error={errors.name} />
								<AppInput name="email" label="Email" placeholder="e.g. john.kelly@gmail.com" control={control} error={errors.email} />
								<AppInput name="roleInCompany" label="Role In Company" placeholder="e.g. Sustainability DevSec" control={control} error={errors.roleInCompany} />
							</div>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-8 my-6">
								<AppRadioGroup
									name="systemRole"
									label="System Role"
									options={roles}
									orientation="horizontal"
									helperText="`Admin` is Peercarbon User and Company Admin is just an external user. A guest is just a guest"
									error={errors.systemRole}
									control={control}
								/>
							</div>
							<Button type="submit" color="primary" isLoading={loading} isDisabled={loading}>
								Submit
							</Button>
						</form>
					</FormProvider>
				</CardBody>
			</Card>
		</AuthRedirectComponent>
	);
};

export default NewUser;
