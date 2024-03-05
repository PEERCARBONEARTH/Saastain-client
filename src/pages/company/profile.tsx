import AuthRedirectComponent from "@/components/auth/AuthRedirectComponent";
import NewBranchModal from "@/components/modals/NewBranchModal";
import AppLayout from "@/layouts/AppLayout";
import { NextPageWithLayout } from "@/types/Layout";
import { BreadcrumbItem, Breadcrumbs, Button, Card, CardBody, CardHeader, Chip, Divider, Input, Tab, Tabs, Textarea, Tooltip } from "@nextui-org/react";
import { MapPin, SearchIcon, Trash2 } from "lucide-react";
import Head from "next/head";
import { useRouter } from "next/router";
import { FiEdit2, FiEdit3 } from "react-icons/fi";
import { IBranches, ICompany } from "@/types/Company";
import { MdAdd } from "react-icons/md";
import { swrFetcher } from "@/lib/api-client";
import { IApiEndpoint } from "@/types/Api";
import useSWR from "swr";

const CompanyProfile: NextPageWithLayout = () => {
	const router = useRouter();
	const { id } = router.query as { id: string };
	const { companyId } = router.query as { companyId: string };

	const {
		data: companyInfo,
		isLoading,
		error: _,
		mutate: mutateCompanies,
	} = useSWR<ICompany>([IApiEndpoint.GET_COMPANY, { id }], swrFetcher, {
		keepPreviousData: true,
	});

	const {
		data: branchInfo,
		error: __,	
		mutate: mutateBranches,
	} = useSWR<IBranches>([IApiEndpoint.GET_COMPANY_BRANCHES, { companyId }], swrFetcher, {
		keepPreviousData: true,
	});

	// const handleDelete

	return (
		<AuthRedirectComponent>
		<>
			<Head>
				<title>My Company Profile - SaaStain</title>
			</Head>
			<Breadcrumbs>
				<BreadcrumbItem>Company</BreadcrumbItem>
				<BreadcrumbItem>Profile</BreadcrumbItem>
			</Breadcrumbs>
			<Tabs variant="underlined" aria-label="Company Profile tabs" className="mt-8" color="primary">
				<Tab key={"locations"} title={<h2 className="text-lg font-semibold">Our Locations</h2>}>
					<div className="bg-gray-200 px-4 py-5 rounded-2xl shadow-lg">
						<div className="flex items-center justify-between">
							<h2 className="text-lg font-bold">Manage Your Locations</h2>
							<NewBranchModal />
						</div>
						<div className="my-4">
							<Input
								classNames={{
									base: "max-w-full h-10",
									mainWrapper: "h-full",
									input: "text-small",
									inputWrapper: "h-full font-normal text-gray-600 rounded-2xl",
								}}
								placeholder="Search ..."
								size="sm"
								startContent={<SearchIcon size={18} />}
								type="search"
								variant="bordered"
								labelPlacement="outside"
							/>
						</div>
						<div className="my-4">
							<p className="text-sm">Total {branchInfo?.length} Branches (locations)</p>
							<div className="grid grid-cols-1 md:grid-cols-3 my-4 gap-4">

								{branchInfo?.map((item) => (
									<Card key={item.id}>
									<CardHeader className="flex items-center justify-between">
										<p>Branch Info</p>
										<div className="flex items-center space-x-2">
										<Tooltip content="Edit Location">
											<Button isIconOnly color="primary" size="sm" variant="light">
											<FiEdit2 className="w-4 h-4" />
											</Button>
										</Tooltip>
										<Tooltip content="Remove Location">
											<Button isIconOnly color="danger" size="sm" variant="light" onClick={() => handleDelete(id)} >
											<Trash2 className="w-4 h-4" />
											</Button>
										</Tooltip>
										</div>
									</CardHeader>
									<CardBody>
										<div className="flex space-x-5">
										<MapPin size={24} />
										<div className="space-y-4">
											<h3 className="font-semibold">{item?.name}</h3>
											<Chip>{item.isMainOffice ? 'Main Branch' : 'Sub-branch'}</Chip>
										</div>
										</div>
									</CardBody>
									</Card>
								))}
								
							</div>
						</div>
					</div>
				</Tab>

				<Tab key={"gen-info"} title={<h2 className="text-lg font-semibold">General Information</h2>}>
					<div className="relative mt-8">
						<div className="rounded-2xl bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 w-full h-56"></div>
						<div className="absolute -bottom-10 left-5 ">
							<img src="https://i.pravatar.cc/150?u=a042581f4e29026704d" className="rounded-full w-24 h-24" />
						</div>
					</div>
					<Card
						classNames={{
							base: "mt-16",
						}}>
						<CardBody>
							<div className="flex flex-col md:flex-row items-center justify-center md:justify-between md:mb-0">
								<h3 className="text-lg font-semibold">General Information</h3>
								<Button color="primary" startContent={<FiEdit3 className="w-4 h-4" />}>
									Edit Profile
								</Button>
							</div>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-5 my-6">
								<Input label={"Name"} value={companyInfo?.companyName} isReadOnly />
								<Input label={"Company Email"} value={companyInfo?.primaryEmail} isReadOnly />
								<Input label={"Head Office"} value={companyInfo?.location} isReadOnly />
								<Input label={"Type of Business"} value={companyInfo?.businessType} isReadOnly />
								<Input label={"Corporate Number"} value={companyInfo?.corporateNumber} isReadOnly />
								<Input label={"Website"} value={companyInfo?.website} isReadOnly />
								<Input label={"Phone No."} value={companyInfo?.phoneNo} isReadOnly />
							</div>
							<div className="my-2">
								<Textarea
									label="Description"
									value={companyInfo?.description}									
									isReadOnly
								/>
							</div>
							<Divider />
						</CardBody>
					</Card>
				</Tab>
				<Tab key={"account-mgmt"} title={<h2 className="text-lg font-semibold">Account Management</h2>}>
					<h2 className="text-lg font-bold">Account Management</h2>
					<div className="my-5">
						<div className="space-y-4 my-2">
							<h3 className="text-sm font-semibold ">Activate Account</h3>
							<p className="text-[14px] md:w-[85%]">
								To activate your account, simply log in with your credentials. If you encounter any issues or need assistance, please reach out to our support team for prompt help
							</p>
							<Button color="primary" variant="bordered" isDisabled>
								Activate
							</Button>
							<Divider />
						</div>
						<div className="space-y-4 my-2">
							<h3 className="text-sm font-semibold ">Deactivate Company</h3>
							<p className="text-[14px] md:w-[85%]">
								Deactivating your account is a permanent action, rendering it inaccessible. Prior to confirming, ensure you've saved any essential information. Once deactivated, contact our support team
								for assistance or reactivation inquiries
							</p>
							<Button color="danger" variant="bordered">
								Deactivate
							</Button>
							<Divider />
						</div>
						<div className="space-y-4 my-2">
							<h3 className="text-sm font-semibold ">Delete Company</h3>
							<p className="text-[14px] md:w-[85%]">
								Deleting your account is a permanent action, removing all data. Please review and download any important information before confirming. Once completed, your account will be deactivated
								immediately. For assistance, contact our support team.
							</p>
							<Button color="danger" variant="bordered">
								Delete
							</Button>
							<Divider />
						</div>
					</div>
				</Tab>
			</Tabs>
			</>
		</AuthRedirectComponent>
		
	);
};

CompanyProfile.getLayout = (c) => <AppLayout>{c}</AppLayout>;

export default CompanyProfile;
