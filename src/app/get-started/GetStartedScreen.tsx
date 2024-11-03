"use client";
import { ReactNode, useState } from "react";
import Image from "next/image";
import AppInput from "@/components/forms/AppInput";
import {
	Button,
	ButtonGroup,
	Card,
	CardBody,
	CardFooter,
	CardHeader,
	CheckboxGroup,
	CheckboxProps,
	Chip,
	cn,
	Divider,
	Dropdown,
	DropdownItem,
	DropdownMenu,
	DropdownTrigger,
	Progress,
	Radio,
	RadioGroup,
	Spacer,
	tv,
	useCheckbox,
	VisuallyHidden,
} from "@nextui-org/react";
import AppCheckbox from "@/components/forms/AppCheckbox";
import Link from "next/link";
import { HiArrowNarrowRight, HiLocationMarker, HiPencilAlt, HiPlus, HiQuestionMarkCircle, HiTrash } from "react-icons/hi";
import { z } from "zod";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import AppTextArea from "@/components/forms/AppTextArea";
import { CheckIcon, ChevronDownIcon, ChevronLeft, ChevronRight, PencilLine } from "lucide-react";
import toast from "react-hot-toast";
import AppSelect from "@/components/forms/AppSelect";
import { AppKey } from "@/types/Global";
import { AppEnumRoutes } from "@/types/AppEnumRoutes";
import useAuthUtils from "@/hooks/useAuthUtils";
import { signIn, signOut, useSession } from "next-auth/react";
import useAuthLogsUtils from "@/hooks/useAuthLogsUtils";
import { AuthLogStatus } from "@/types/AuthLog";
import useCompanyUtils from "@/hooks/useCompanyUtils";
import useBranchUtils from "@/hooks/useBranchUtils";
import { BranchType, OrganizationalBoundaryType } from "@/types/Company";
import { IOption } from "@/types/Forms";
import useConfigUtils from "@/hooks/useConfigUtils";
import { nanoid } from "nanoid";

type TStage = "signup" | "company-profile" | "company-industry" | "org-boundary" | "new-branch" | "branches" | "loading" | "finish";

const signupFormSchema = z
	.object({
		name: z.string().min(1, { message: "Name is required" }),
		roleInCompany: z.string().min(1, { message: "Role in Company is required" }),
		email: z.string().email({ message: "Invalid Email Address" }),
		password: z.string().min(8, {
			message: "Password must be at least 8 characters long",
		}),
		confirmPassword: z.string().min(8, {
			message: "Password must be at least 8 characters long",
		}),
		terms: z.boolean({ message: "Please accept terms" }),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords do not match",
		path: ["confirmPassword"],
	});

const companyProfileFormSchema = z.object({
	companyName: z.string().min(1, { message: "Company Name is required" }),
	location: z.string().min(1, { message: "Please enter your company location" }),
	description: z.string().min(1, { message: "Please a brief description of your company" }),
	phoneNo: z.string().min(8, { message: "Please enter phone number" }),
	primaryEmail: z.string().email({ message: "Please enter a valid email address" }),
});

const newBranchSchema = z.object({
	name: z.string().min(1, "Name is required"),
	type: z.string().min(1, "Select branch type"),
	address: z.string().min(1, "Enter the address of the branch"),
});

const branchTypeOptions = [
	{
		label: "Subsidiary",
		value: BranchType.SUBSIDIARY,
	},
	{
		label: "Franchise",
		value: BranchType.FRANCHISE,
	},
	{
		label: "Satellite",
		value: BranchType.SATELLITE,
	},
] satisfies IOption[];

const branchesDescriptionsMap = {
	"save-and-new": "Save Branch and Add a new one before moving to the next step.",
	save: "Save branch and continue to the next step.",
};

const branchesLabelsMap = {
	"save-and-new": "Save & Add New",
	save: "Next",
};

interface IBranchInfo {
	id: string;
	name: string;
	type: string;
	address: string;
}

interface BranchItemSectionProps {
	theme: "primary" | "secondary" | "warning" | "danger" | "success";
	branchInfo: IBranchInfo;
	onEdit?: VoidFunction;
	onRemove?: VoidFunction;
	removeBtnDisabled?: boolean;
}

const themes = ["primary", "secondary", "warning", "danger", "success"];

const getThemeByIndex = (index: number) => {
	return themes[index % themes.length] as "primary" | "secondary" | "warning" | "danger" | "success";
};

const getTextColor = (theme: "primary" | "secondary" | "warning" | "danger" | "success") => {
	switch (theme) {
		case "primary":
			return "text-primary-500";
		case "secondary":
			return "text-secondary-500";
		case "warning":
			return "text-warning-500";
		case "danger":
			return "text-danger-500";
		case "success":
			return "text-success-500";
		default:
			return "text-black";
	}
};

const GetStartedScreen = () => {
	const [currentStage, setCurrentStage] = useState<TStage>("signup");
	const [signupFormData, setSignupFormData] = useState<z.infer<typeof signupFormSchema>>(null);
	const [companyProfileFormData, setCompanyProfileFormData] = useState<z.infer<typeof companyProfileFormSchema>>(null);
	const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
	const [selectedBoundary, setSelectedBoundary] = useState<string>("");
	const [selectedActionBranchAdd, setSelectedActionBranchAdd] = useState<Set<AppKey>>(new Set(["save"]));
	const [allBranches, setAllBranches] = useState<IBranchInfo[]>([]);
	const [signUpError, setSignUpError] = useState<string>("");
	const [edittedBranchId, setEdittedBranchId] = useState<string>("");

	const { data: session } = useSession();
	const { createCompanyAdmin } = useAuthUtils();
	const { saveNewAuthLog } = useAuthLogsUtils();
	const { createCompany, updateCompanyProfile } = useCompanyUtils();
	const { bulkAddBranchesToCompany } = useBranchUtils();
	const { initCompanyConfig } = useConfigUtils();

	const selectedActionBranchAddValue = Array.from(selectedActionBranchAdd)[0];

	const signupFormMethods = useForm<z.infer<typeof signupFormSchema>>({
		resolver: zodResolver(signupFormSchema),
		defaultValues: {
			name: "",
			roleInCompany: "",
			email: "",
			password: "",
			confirmPassword: "",
			terms: true,
		},
	});

	const {
		reset: resetSignupForm,
		control: controlSignup,
		handleSubmit: handleSubmitSignup,
		formState: { errors: signupFormErrors },
	} = signupFormMethods;

	const onSubmitSignup = (data: Required<z.infer<typeof signupFormSchema>>) => {
		if (!data.terms) {
			toast.error("Please accept terms.");
			return;
		}
		setSignupFormData(data);
		setCurrentStage("company-profile");
	};

	const companyProfileFormMethods = useForm<z.infer<typeof companyProfileFormSchema>>({
		resolver: zodResolver(companyProfileFormSchema),
		defaultValues: {
			companyName: "",
			location: "",
			description: "",
			phoneNo: "",
			primaryEmail: "",
		},
	});

	const {
		reset: resetCompanyProfileForm,
		control: controlCompanyProfile,
		handleSubmit: handleSubmitCompanyProfile,
		formState: { errors: companyProfileErrors },
	} = companyProfileFormMethods;

	const onSubmitCompanyProfile = async (data: Required<z.infer<typeof companyProfileFormSchema>>) => {
		setCompanyProfileFormData(data);
		setCurrentStage("company-industry");
	};

	const onClickNextIndustries = () => {
		if (selectedIndustries.length === 0) {
			toast.error("Please select at least one industry");
			return;
		}

		setCurrentStage("org-boundary");
	};

	const onClickNextOrgBoundary = () => {
		if (!selectedBoundary) {
			toast.error("Please select a boundary for your company");
			return;
		}

		if (allBranches?.length > 0) {
			const lastBranch = allBranches[allBranches.length - 1];
			setNewBranchValue("name", lastBranch.name);
			setNewBranchValue("type", lastBranch.type);
			setNewBranchValue("address", lastBranch.address);
		}

		setCurrentStage("new-branch");
	};

	const newBranchFormMethods = useForm<z.infer<typeof newBranchSchema>>({
		resolver: zodResolver(newBranchSchema),
		defaultValues: {
			name: "",
			type: "",
			address: "",
		},
	});

	const {
		reset: resetNewBranchForm,
		control: controlNewBranch,
		handleSubmit: handleSubmitNewBranch,
		formState: { errors: newBranchFormErrors },
		setValue: setNewBranchValue,
	} = newBranchFormMethods;

	const onSubmitNewBranch = (data: Required<z.infer<typeof newBranchSchema>>) => {
		if (edittedBranchId) {
			const branchInfo = allBranches.find((item) => item.id === edittedBranchId);
			let info = {
				...data,
				id: branchInfo.id,
			};

			let allBranchItems = [...allBranches];

			let updatedBranches = allBranchItems.map((item) => {
				if (item.id === edittedBranchId) {
					return info;
				}

				return item;
			});

			setAllBranches(updatedBranches);
			setCurrentStage("branches");
		} else {
			setAllBranches((val) => [...val, { ...data, id: nanoid() }]);
			resetNewBranchForm();
			if (selectedActionBranchAddValue === "save") {
				setCurrentStage("branches");
			}
		}
		setEdittedBranchId(null)
	};

	const onClickBackBranches = () => {
		const lastBranch = allBranches[allBranches.length - 1];
		setNewBranchValue("name", lastBranch.name);
		setNewBranchValue("type", lastBranch.type);
		setNewBranchValue("address", lastBranch.address);
		setEdittedBranchId(lastBranch.id);
		setCurrentStage("new-branch");
	};

	const onClickNextBranches = () => {
		setCurrentStage("loading");
		saveInfo();
	};

	const resetAndSetSession = async () => {
		await signOut({
			redirect: false,
		});

		// signin again
		const signInResp = await signIn("credentials", {
			email: signupFormData.email,
			password: signupFormData.password,
			redirect: false,
		});
	};

	const loadCompanyConfig = async (companyId: string) => {
		try {
			const resp = await initCompanyConfig(companyId);
		} catch (err) {
			console.log("err");
		}
	};

	const saveInfo = async () => {
		const id = toast.loading("Creating Account ...");
		try {
			const resp = await createCompanyAdmin(signupFormData.name, signupFormData.roleInCompany, signupFormData.email, signupFormData.password);
			if (resp.status === "success") {
				toast.success("Account created successfully, Check Your Email for a verification email");

				// now signin
				const signInResp = await signIn("credentials", {
					email: signupFormData.email,
					password: signupFormData.password,
					redirect: false,
				});

				if (signInResp.ok) {
					// setup the company
					toast.loading("Setting up your company profile ...", { id });
					try {
						saveNewAuthLog({ email: signupFormData.email, status: AuthLogStatus.SUCCESS });
					} catch (err) {}
					// halt execution flow to await for session to be available
					await new Promise((resolve) => setTimeout(resolve, 500));
					const response = await createCompany({
						userId: session?.user?.id,
						companyName: companyProfileFormData.companyName,
						location: companyProfileFormData.location,
						phoneNo: companyProfileFormData.phoneNo,
						description: companyProfileFormData.description,
						primaryEmail: companyProfileFormData.primaryEmail,
					});

					if (response?.status === "success") {
						loadCompanyConfig(response?.data?.id);
						toast.success("Company Profile Set up successfully ...");
						// update the industry
						const industries = selectedIndustries.join(", ");

						const promises = [
							updateCompanyProfile({ id: response?.data?.id, industry: industries, organizationaBoundaryType: selectedBoundary as OrganizationalBoundaryType, terms: true }),
							bulkAddBranchesToCompany({ companyId: response?.data?.id, dataItems: allBranches }),
						];

						toast.loading("Setting Up Organization Boundary, Branches & Industries", { id });

						const resp = await Promise.all(promises);

						toast.success("Setup Complete", { id });

						resetAndSetSession();
						setCurrentStage("finish");
					}
				}
			} else {
				toast.error(resp.msg, { id });
				setCurrentStage("signup");
			}
		} catch (error) {
			toast.error(error.message ?? "An error occurred. Please try again", { id });
			setSignUpError(error?.response?.data?.msg);
		}
	};

	const onRemoveBranch = (id: string) => {
		setAllBranches((prevBranches) => prevBranches.filter((item) => item.id !== id));
	};

	const onEditBranch = (id: string) => {
		const branchItem = allBranches.find((item) => item.id === id);

		setNewBranchValue("name", branchItem.name);
		setNewBranchValue("type", branchItem.type);
		setNewBranchValue("address", branchItem.address);
		setCurrentStage("new-branch");
		setEdittedBranchId(id)
	};

	const onPressNewBranch = () => {
		resetNewBranchForm();
		setCurrentStage("new-branch");
	};

	return (
		<>
			{currentStage === "signup" && (
				<div className="grid grid-cols-1 md:grid-cols-5 bg-[#133726]">
					<div className="col-auto md:col-span-2 h-screen bg-white md:rounded-r-2xl">
						<div className="flex flex-col justify-center h-full px-3 md:px-10">
							<Image src="/images/saastain_logo.svg" alt="SaaStain Logo" width={150} height={40} className="mb-8" />
							<div className="space-y-2">
								<h1 className="text-2xl font-bold text-[#2D3748]">Get Started With Saastain</h1>
								<p className="text-[#718096]">Fill the details below to create an account</p>
							</div>
							<FormProvider {...signupFormMethods}>
								<form className="mt-4" onSubmit={handleSubmitSignup(onSubmitSignup)}>
									<AppInput label={"Name"} placeholder="Your Full Name" labelPlacement="inside" name="name" control={controlSignup} error={signupFormErrors.name} />
									<Spacer y={4} />
									<AppInput label="Email Address" placeholder="Email" type="email" labelPlacement="inside" name="email" control={controlSignup} error={signupFormErrors.email} />
									<Spacer y={4} />
									<AppInput label={"Role in Company"} placeholder="Your role in company" labelPlacement="inside" name="roleInCompany" control={controlSignup} error={signupFormErrors.roleInCompany} />
									<Spacer y={4} />
									<AppInput label="Password" placeholder="Password" type="password" labelPlacement="inside" isPassword name="password" control={controlSignup} error={signupFormErrors.password} />
									<Spacer y={4} />
									<AppInput
										label="Confirm Password"
										placeholder="Confirm Password"
										labelPlacement="inside"
										type="password"
										isPassword
										name="confirmPassword"
										control={controlSignup}
										error={signupFormErrors.confirmPassword}
									/>
									<Spacer y={4} />
									<AppCheckbox
										label={
											<div>
												I agree to our{" "}
												<Link href={"https://saastain.app/privacy"} target="_blank" className="underline underline-offset-4">
													Terms of Service{" "}
												</Link>
												and{" "}
												<Link href={"https://saastain.app/privacy"} target="_blank" className="underline underline-offset-4">
													Privacy Policy
												</Link>
											</div>
										}
										name="terms"
										control={controlSignup}
									/>
									<Spacer y={4} />
									<Button type="submit" color="primary" className="bg-[#22614A]" endContent={<HiArrowNarrowRight className="w-5 h-5" />} fullWidth>
										Sign Up
									</Button>
									<Spacer y={4} />
									<div className="flex items-center justify-center gap-2">
										<p className="text-sm text-gray-600">Already have an account?</p>
										<Button type="button" as={Link} href={`/auth/login`} variant="bordered">
											Login
										</Button>
									</div>
								</form>
							</FormProvider>
						</div>
					</div>
					<div className="hidden md:block md:col-span-3 h-screen px-6 py-10">
						<img src="/images/Onboarding-bg.png" alt="" className="h-full w-full object-cover" />
					</div>
				</div>
			)}
			{currentStage === "company-profile" && (
				<div className="grid grid-cols-1 md:grid-cols-6">
					<div className="col-auto md:col-span-4">
						<div className="w-full h-screen">
							<div className="flex flex-col items-center justify-center h-full px-2 md:px-28">
								<Progress value={100} color="default" className="w-full" />
								<div className="mt-5 w-full">
									<FormProvider {...companyProfileFormMethods}>
										<form onSubmit={handleSubmitCompanyProfile(onSubmitCompanyProfile)}>
											<Card className="w-full md:px-5">
												<CardHeader>
													<Button variant="light" color="primary" startContent={<ChevronLeft className="w-5 h-5" />} type="button" onPress={() => setCurrentStage("signup")}>
														Back
													</Button>
												</CardHeader>
												<Divider />
												<CardBody>
													<h1 className="text-xl font-bold">Tell Us More About Your Company</h1>
													<Spacer y={7} />
													<AppInput
														label={"Your Company Name"}
														placeholder="Name"
														labelPlacement="inside"
														name="companyName"
														control={controlCompanyProfile}
														error={companyProfileErrors.companyName}
													/>
													<Spacer y={5} />
													<AppInput
														label={"Location"}
														placeholder="Your company location"
														labelPlacement="inside"
														name="location"
														control={controlCompanyProfile}
														error={companyProfileErrors.location}
													/>
													<Spacer y={5} />
													<AppInput
														label={"Official Phone Number "}
														placeholder="+254712345678"
														labelPlacement="inside"
														name="phoneNo"
														control={controlCompanyProfile}
														error={companyProfileErrors.phoneNo}
													/>
													<Spacer y={5} />
													<AppInput
														label={"Official Company Email Address"}
														placeholder="info@company.com"
														helperText="We'll never share your details. See our Privacy Policy."
														labelPlacement="inside"
														name="primaryEmail"
														control={controlCompanyProfile}
														error={companyProfileErrors.primaryEmail}
													/>
													<Spacer y={5} />
													<AppTextArea
														label="Brief description of your company"
														placeholder="In 10 words describe your company"
														labelPlacement="inside"
														startContent={<PencilLine size={18} className="text-sm text-default-400 pointer-events-none flex-shrink-0 mr-3" />}
														name="description"
														control={controlCompanyProfile}
														error={companyProfileErrors.description}
													/>
												</CardBody>
												<Divider />
												<CardFooter className="justify-end">
													<Button className="bg-primary-800 text-white" endContent={<ChevronRight className="w-5 h-5" />} type="submit">
														Next
													</Button>
												</CardFooter>
											</Card>
										</form>
									</FormProvider>
								</div>
							</div>
						</div>
					</div>
					<div className="hidden md:block md:col-span-2">
						<div className="bg-create-company h-screen"></div>
					</div>
				</div>
			)}
			{currentStage === "company-industry" && (
				<Wrapper>
					<div className="flex flex-col items-center justify-center h-full px-28">
						<Progress value={100} color="warning" className="w-full" />
						<div className="mt-5 w-full">
							<Card className="w-full px-5">
								<CardHeader>
									<Button onPress={() => setCurrentStage("company-profile")} type="button" variant="light" color="primary" startContent={<ChevronLeft className="w-5 h-5" />}>
										Back
									</Button>
								</CardHeader>
								<Divider />
								<CardBody>
									<h1 className="text-xl font-bold">Where does your company lie ?</h1>
									<Spacer y={7} />
									<CheckboxGroup className="gap-5" orientation="horizontal" value={selectedIndustries} onChange={setSelectedIndustries}>
										<CustomCheckbox value={"agriculture"}>Agriculture</CustomCheckbox>
										<CustomCheckbox value={"aviation"}>Aviation</CustomCheckbox>
										<CustomCheckbox value={"banking"}>Banking</CustomCheckbox>
										<CustomCheckbox value={"manufacturing"}>Manufacturing</CustomCheckbox>
										<CustomCheckbox value={"logistics"}>Logistics & Travel</CustomCheckbox>
									</CheckboxGroup>
								</CardBody>
								<Divider />
								<CardFooter className="justify-end">
									<Button className="bg-primary-800 text-white" endContent={<ChevronRight className="w-5 h-5" />} onPress={onClickNextIndustries}>
										Next
									</Button>
								</CardFooter>
							</Card>
						</div>
					</div>
				</Wrapper>
			)}
			{currentStage === "org-boundary" && (
				<Wrapper>
					<div className="flex flex-col items-center justify-center w-full h-full px-2 md:px-28">
						<Progress value={100} color="danger" className="w-full" />
						<div className="mt-5 w-full">
							<Card className="w-full px-5">
								<CardHeader className="justify-between">
									<Button onPress={() => setCurrentStage("company-industry")} variant="light" color="primary" startContent={<ChevronLeft className="w-5 h-5" />}>
										Back
									</Button>
									<div className="flex items-center">
										{/* <Button type="button" variant="light" color="primary">
											Skip
										</Button> */}
										<Button type="button" variant="light" color="default" isIconOnly>
											<HiQuestionMarkCircle className="w-5 h-5" />
										</Button>
									</div>
								</CardHeader>
								<Divider />
								<CardBody>
									<h1 className="text-xl font-bold">Define Organizational Boundaries.</h1>
									<Spacer y={7} />
									<RadioGroup
										label="Establish your organizational boundaries to define which emissions sources will be included in your accounting."
										color="primary"
										value={selectedBoundary}
										onValueChange={setSelectedBoundary}>
										<Radio value={OrganizationalBoundaryType.OPERATIONAL_CONTROL} description="Select operational control to include emissions from facilities you manage directly.">
											We use Operational Control to track
										</Radio>
										<Radio value={OrganizationalBoundaryType.FINANCIAL_CONTROL} description="Select operational control to include emissions from facilities you manage directly.">
											We use Financial Control to track
										</Radio>
										<Radio value={OrganizationalBoundaryType.GEOGRAPHICAL_CONTROL} description="List all locations or branches included in emissions tracking.">
											We use Geographical Scope to track
										</Radio>
									</RadioGroup>
								</CardBody>
								<Divider />
								<CardFooter className="justify-between">
									<Button endContent={<ChevronRight className="w-5 h-5" />} variant="bordered">
										Learn More
									</Button>

									<Button className="bg-primary-800 text-white" endContent={<ChevronRight className="w-5 h-5" />} onPress={onClickNextOrgBoundary}>
										Next
									</Button>
								</CardFooter>
							</Card>
						</div>
					</div>
				</Wrapper>
			)}
			{currentStage === "new-branch" && (
				<Wrapper>
					<div className="flex flex-col items-center justify-center h-full px-2 md:px-28">
						<Progress value={100} color="primary" className="w-full" />
						<div className="mt-5 w-full">
							<FormProvider {...newBranchFormMethods}>
								<form onSubmit={handleSubmitNewBranch(onSubmitNewBranch)}>
									<Card className="w-full px-5">
										<CardHeader className="justify-between">
											<Button onPress={() => setCurrentStage("org-boundary")} type="button" variant="light" color="primary" startContent={<ChevronLeft className="w-5 h-5" />}>
												Back
											</Button>
											<div className="flex items-center">
												{/* <Button type="button" variant="light" color="primary">
													Skip
												</Button> */}
												<Button type="button" variant="light" color="default" isIconOnly>
													<HiQuestionMarkCircle className="w-5 h-5" />
												</Button>
											</div>
										</CardHeader>
										<Divider />
										<CardBody>
											<h1 className="text-xl font-bold">{edittedBranchId ? "Update Branch Info" : "Create a new branch"}</h1>
											<AppInput label={"Name"} placeholder="e.g. HQ" name="name" control={controlNewBranch} error={newBranchFormErrors.name} />
											<Spacer y={7} />
											<AppSelect label="Branch Type" options={branchTypeOptions} name="type" control={controlNewBranch} error={newBranchFormErrors.type} />
											<Spacer y={4} />
											<AppInput label={"Address"} placeholder="e.g. Drive In" name="address" control={controlNewBranch} error={newBranchFormErrors.address} />
										</CardBody>
										<Divider />
										<CardFooter className="justify-between">
											{edittedBranchId && (
												<Button className="bg-primary-800 text-white" color="primary" type="submit">
													Update Branch
												</Button>
											)}
											{!edittedBranchId && (
												<ButtonGroup variant="flat">
													<Button className="bg-primary-800 text-white" color="primary" type="submit">
														{branchesLabelsMap[selectedActionBranchAddValue]}
													</Button>
													<Dropdown placement="bottom-end">
														<DropdownTrigger type="button">
															<Button className="bg-primary-800 text-white" color="primary" type="button" isIconOnly>
																<ChevronDownIcon />
															</Button>
														</DropdownTrigger>
														<DropdownMenu
															disallowEmptySelection
															aria-label="Merge options"
															selectedKeys={selectedActionBranchAdd}
															selectionMode="single"
															onSelectionChange={(val) => {
																setSelectedActionBranchAdd(val as any);
															}}
															className="max-w-[300px]">
															<DropdownItem key="save-and-new" description={branchesDescriptionsMap["save-and-new"]}>
																{branchesLabelsMap["save-and-new"]}
															</DropdownItem>
															<DropdownItem key="save" description={branchesDescriptionsMap["save"]}>
																{branchesLabelsMap["save"]}
															</DropdownItem>
														</DropdownMenu>
													</Dropdown>
												</ButtonGroup>
											)}
											{/* <Button endContent={<ChevronRight className="w-5 h-5" />} variant="bordered">
												Save & Add New
											</Button>
											<Button className="bg-primary-800 text-white" endContent={<ChevronRight className="w-5 h-5" />}>
												Next
											</Button> */}
										</CardFooter>
									</Card>
								</form>
							</FormProvider>
						</div>
					</div>
				</Wrapper>
			)}
			{currentStage === "branches" && (
				<BranchListingWrapper>
					<div className="mt-5 w-full">
						<Card className="w-full px-5 py-3 max-h-[80vh] h-full overflow-y-scroll">
							<CardHeader className="justify-between">
								<Button variant="light" color="primary" startContent={<ChevronLeft className="w-5 h-5" />} onPress={onClickBackBranches}>
									Back
								</Button>
								<div className="flex items-center">
									{/* <Button variant="light" color="primary">
										Skip
									</Button> */}
									<Button variant="light" color="default" isIconOnly>
										<HiQuestionMarkCircle className="w-5 h-5" />
									</Button>
								</div>
							</CardHeader>
							<Divider />
							<CardBody>
								<h1 className="text-xl font-bold">Your Company Branches</h1>
								<Spacer y={7} />
								<div className="space-y-5">
									{allBranches?.map((branch, idx) => (
										<BranchItemSection
											key={branch.id}
											theme={getThemeByIndex(idx)}
											branchInfo={branch}
											onEdit={() => onEditBranch(branch.id)}
											onRemove={() => onRemoveBranch(branch.id)}
											removeBtnDisabled={allBranches.length === 1}
										/>
									))}
								</div>
							</CardBody>
							<Divider />
							<Spacer y={3} />
							<CardFooter className="justify-between">
								<Button variant="bordered" color="primary" endContent={<HiPlus className="w-5 h-5" />} onPress={onPressNewBranch}>
									New Branch
								</Button>
								<Button className="bg-primary-800 text-white" endContent={<ChevronRight className="w-5 h-5" />} onPress={onClickNextBranches}>
									Next
								</Button>
							</CardFooter>
						</Card>
					</div>
				</BranchListingWrapper>
			)}
			{currentStage === "loading" && (
				<div className="h-screen bg-[#133726]">
					<div className="flex items-center justify-center h-full">
						<div className="flex flex-col text-center">
							<h1 className="text-white text-3xl font-bold">We are creating your account, wait ....</h1>
							<div className="mt-5">
								<p className="text-green-50">Carbon accounting embedded with fintech</p>
							</div>
							<div className="mt-5">
								<Progress size="sm" isIndeterminate classNames={{ indicator: "bg-saastain-brown " }} />
							</div>
						</div>
					</div>
				</div>
			)}
			{currentStage === "finish" && (
				<div className="grid grid-cols-1">
					<div className="h-screen">
						<div className="flex items-center justify-center h-full">
							<Card className="max-w-xl w-full px-5 py-4">
								<CardHeader>
									<h1 className="text-2xl font-bold">Updating your company</h1>
								</CardHeader>
								<CardBody className="gap-4">
									<p className="font-medium">You have updated your companies boundaries , and set up your branches. Let's begin your emission tracking</p>
									<Image src={"/images/onboarding/stars.png"} width={150} height={80} alt="Stars" />
								</CardBody>
								<Divider />
								<CardFooter className="justify-end">
									<Button color="primary" as={Link} href={AppEnumRoutes.APP_WELCOME} className="bg-primary-800" endContent={<ChevronRight className="w-5 h-5" />}>
										Open Dashboard
									</Button>
								</CardFooter>
							</Card>
						</div>
					</div>
				</div>
			)}
		</>
	);
};

const Wrapper = ({ children }: { children: ReactNode }) => {
	return (
		<div className="grid grid-cols-1 md:grid-cols-6">
			<div className="col-auto md:col-span-4">
				<div className="w-full h-screen">{children}</div>
			</div>
			<div className="hidden md:block md:col-span-2">
				<div className="bg-create-company h-screen"></div>
			</div>
		</div>
	);
};

const BranchListingWrapper = ({ children }: { children: ReactNode }) => {
	return (
		<div className="grid grid-cols-1 md:grid-cols-6">
			<div className="col-auto md:col-span-4">
				<div className="w-full flex-1">
					<div className="flex flex-col flex-1 items-center justify-center h-screen px-2 md:px-28 overflow-y-auto py-10">
						<Progress value={100} color="primary" className="w-full" />
						{children}
					</div>
				</div>
			</div>
			<div className="hidden md:block md:col-span-2">
				<div className="bg-create-company h-screen"></div>
			</div>
		</div>
	);
};

const BranchItemSection = ({ theme, branchInfo, onEdit, onRemove, removeBtnDisabled = false }: BranchItemSectionProps) => {
	return (
		<div className="px-4 py-5 border-1 border-gray-300 rounded-xl">
			<div className="flex items-center justify-between">
				<Chip color={theme} variant="flat">
					{branchInfo.type}
				</Chip>
				<div className="flex items-center gap-2">
					<Button isIconOnly variant="light" color={theme} onPress={onEdit}>
						<HiPencilAlt className="w-5 h-5" />
					</Button>
					<Button isIconOnly variant="light" color={theme} onPress={onRemove} isDisabled={removeBtnDisabled}>
						<HiTrash className="w-5 h-5" />
					</Button>
				</div>
			</div>
			<div className="mt-2 space-y-3">
				<h1 className={cn(getTextColor(theme), "font-bold text-lg")}>{branchInfo.name}</h1>
				<p className={cn(getTextColor(theme))}>{branchInfo.address}</p>
				<Button startContent={<HiLocationMarker className="w-5 h-5" />} color={theme} variant="bordered">
					View Location
				</Button>
			</div>
		</div>
	);
};

const checkbox = tv({
	slots: {
		base: "border-default hover:bg-default-200",
		content: "text-default-500",
	},
	variants: {
		isSelected: {
			true: {
				base: "border-primary bg-primary-100 hover:bg-primary-200 hover:border-primary-200",
				content: "text-primary pl-1",
			},
		},
		isFocusVisible: {
			true: {
				base: "outline-none ring-2 ring-focus ring-offset-2 ring-offset-background",
			},
		},
	},
});

const CustomCheckbox = (props: CheckboxProps) => {
	const { children, isSelected, isFocusVisible, getBaseProps, getLabelProps, getIconProps, getInputProps } = useCheckbox({ ...props });

	const styles = checkbox({ isSelected, isFocusVisible });

	return (
		<label {...getBaseProps()}>
			<VisuallyHidden>
				<input {...getInputProps()} />
			</VisuallyHidden>
			<Chip
				classNames={{ base: styles.base(), content: styles.content() }}
				radius="sm"
				color="primary"
				variant={isSelected ? "flat" : "faded"}
				size="lg"
				startContent={isSelected ? <CheckIcon className="ml-1 w-5 h-5 text-primary" /> : null}
				{...(getLabelProps() as any)}>
				<span className="text-sm">{children ? children : isSelected ? "Enabled" : "Disabled"}</span>
			</Chip>
		</label>
	);
};

export default GetStartedScreen;
