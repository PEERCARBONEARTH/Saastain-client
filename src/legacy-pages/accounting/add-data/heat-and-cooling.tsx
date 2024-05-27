import AppLayout from "@/layouts/AppLayout";
import { NextPageWithLayout } from "@/types/Layout";
import { useForm, FormProvider } from "react-hook-form";
import AppInput from "@/components/forms/AppInput";
import { Card, Button, Breadcrumbs, BreadcrumbItem, CardHeader, CardBody, CardFooter, AccordionItem, Accordion } from "@nextui-org/react";
import { Check, XIcon } from "lucide-react";
import AppSelect from "@/components/forms/AppSelect";
import AppDatePicker from "@/components/buttons/datepicker";
import { FaAnglesLeft, FaAnglesRight, FaLeaf } from "react-icons/fa6";
import { generateOptions } from "@/helpers";
import { InferType, date, number, object, string } from "yup";
import { getMaxDate, getMinDate } from "@/utils";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMemo, useState } from "react";
import { IScopeTwoElectricity } from "@/types/Accounting";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import useDidHydrate from "@/hooks/useDidHydrate";
import toast from "react-hot-toast";
import useAccountingDataUtils from "@/hooks/useAccountingDataUtils";
import { AppEnumRoutes } from "@/types/AppEnumRoutes";
import HeatAndSteamConfirmModal from "@/components/modals/HeatAndSteamConfirmModal";
import Head from "next/head";
import AuthRedirectComponent from "@/components/auth/AuthRedirectComponent";

const emissionSources = ["Heat and steam", "Cooling"];
const sourceUnits = ["kwh", "mwh"];

const schema = object({
	date: date().min(getMinDate(), "Date cannot be before 2015-01-01").max(getMaxDate(), "Date cannot be after today"),
	emissionSource: string().required("Emission Source is required"),
	units: string().required("Unit is required"),
	amount: number().required("Amount is required"),
});

const HeatAndSteam: NextPageWithLayout = () => {
	const [modalValues, setModalValues] = useState<Omit<IScopeTwoElectricity, "id" | "createdAt" | "updatedAt"> & { date: string }>();
	const [openConfirmModal, setOpenConfirmModal] = useState(false);
	const [isSaving, setIsSaving] = useState(false);
	const formMethods = useForm({
		resolver: yupResolver(schema),
		defaultValues: {
			date: getMaxDate(),
			emissionSource: "",
			units: "",
			amount: 1,
		},
	});

	const {
		handleSubmit,
		reset,
		control,
		formState: { errors },
	} = formMethods;

	const { saveHeatAndSteam } = useAccountingDataUtils();
	const router = useRouter();
	const { status, data: session } = useSession();
	const { didHydrate } = useDidHydrate();

	const account = useMemo(() => {
		if (didHydrate && status === "authenticated") {
			return session?.user;
		}

		return null;
	}, [status, didHydrate]);

	const onSubmit = async (data: InferType<typeof schema>) => {
		const { date, emissionSource, units, amount } = data;

		setModalValues({ date: date.toISOString(), emissionSource, units, amount });

		setOpenConfirmModal(true);
	};

	const onConfirm = async () => {
		const dataToSave = {
			...modalValues,
			CompanyId: account?.company?.id,
		};

		setIsSaving(true);
		const id = toast.loading("Saving data...");

		try {
			const resp = await saveHeatAndSteam(dataToSave);

			if (resp?.status === "success") {
				toast.success("Data saved successfully", { id });
				reset();
				setOpenConfirmModal(false);
				router.push(AppEnumRoutes?.APP_DATA_LIST);
			} else {
				toast.error("An error occurred while saving data", { id });
			}
		} catch (err) {
			toast.error("An error occurred while saving data", { id });
		} finally {
			setIsSaving(false);
		}
	};

	return (
		<AuthRedirectComponent>
			<Card className="p-6 bg-[#E4FCE6] overflow-y-scroll">
				<Head>
					<title>Heat & Steam - SaaStain</title>
				</Head>
				<CardHeader className="flex flex-col items-start justify-center space-y-4">
					<Breadcrumbs>
						<BreadcrumbItem>Accounting</BreadcrumbItem>
						<BreadcrumbItem>Add Data</BreadcrumbItem>
					</Breadcrumbs>
					<div className="w-full">
						<h1 className="text-xl font-bold">Heat & Steam</h1>
						<p className="text-sm">In this section please enter the details on electricity consumption from owned or controlled sources.</p>
						<Accordion>
							<AccordionItem
								key="anchor"
								aria-label="Learn More"
								indicator={({ isOpen }) => (isOpen ? <FaAnglesLeft /> : <FaAnglesRight />)}
								title={<span className="text-base text-primary-600 font-semibold">Learn More</span>}>
								<div className="space-y-4">
									<div className="flex space-x-2 items-center">
										<FaLeaf className="w-4 h-4" />
										<p className="text-xs md:text-sm font-medium">Providing specific usage data for different facilities and equipment can lead to more accurate calculations</p>
									</div>
									<div className="flex space-x-2 items-center">
										<FaLeaf className="w-4 h-4" />
										<p className="text-xs md:text-sm font-medium">If available, integrate vertical data from smart meters for more frequent consumption insights</p>
									</div>
									<div className="flex space-x-2 items-center">
										<FaLeaf className="w-4 h-4" />
										<p className="text-xs md:text-sm font-medium">Consider accounting for electricity generated</p>
									</div>
									<div className="flex space-x-2 items-center">
										<FaLeaf className="w-4 h-4" />
										<p className="text-xs md:text-sm font-medium">If your organization uses renewable energy sources, be sure to document this to reflect the emission benefits of cleaner energy</p>
									</div>
								</div>
							</AccordionItem>
						</Accordion>
					</div>
				</CardHeader>
				<FormProvider {...formMethods}>
					<form onSubmit={handleSubmit(onSubmit)}>
						<CardBody>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-10">
								<div className="space-y-2">
									<p className="text-sm font-semibold">Select Accounting Period</p>
									<AppDatePicker className="w-full" name="date" control={control} />
									{errors.date && <p className="text-xs text-red-500">{errors.date.message}</p>}
								</div>
								<AppSelect label="Emission Source" options={generateOptions(emissionSources)} name="emissionSource" control={control} error={errors.emissionSource} />
								<AppSelect label="Source Unit" options={generateOptions(sourceUnits)} name="units" control={control} error={errors.units} />
								<AppInput label="Amount of Emissions" name="amount" type="number" control={control} error={errors.amount} />
							</div>
						</CardBody>
						<CardFooter className="justify-between md:justify-end gap-5 mt-5 md:mt-10">
							<Button color="primary" startContent={<Check size={15} />} type="submit">
								Calculate
							</Button>
							<Button color="primary" startContent={<XIcon size={15} />} variant="bordered">
								Cancel
							</Button>
						</CardFooter>
					</form>
				</FormProvider>
				<HeatAndSteamConfirmModal isOpen={openConfirmModal} setIsOpen={setOpenConfirmModal} values={modalValues} onConfirm={onConfirm} isSaving={isSaving} />
			</Card>
		</AuthRedirectComponent>
	);
};

HeatAndSteam.getLayout = (page) => <AppLayout>{page}</AppLayout>;

export default HeatAndSteam;
