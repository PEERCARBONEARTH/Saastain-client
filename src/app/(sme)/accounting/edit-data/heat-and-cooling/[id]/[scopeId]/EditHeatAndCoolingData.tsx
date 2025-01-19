"use client";
import { useForm, FormProvider } from "react-hook-form";
import AppInput from "@/components/forms/AppInput";
import { Card, Button, Breadcrumbs, BreadcrumbItem, CardHeader, CardBody, CardFooter, AccordionItem, Accordion } from "@heroui/react";
import { Check, XIcon } from "lucide-react";
import AppSelect from "@/components/forms/AppSelect";
import AppDatePicker from "@/components/buttons/datepicker";
import { FaAnglesLeft, FaAnglesRight, FaLeaf } from "react-icons/fa6";
import { generateOptions } from "@/helpers";
import { InferType, date, number, object, string } from "yup";
import { getMaxDate, getMinDate } from "@/utils";
import { yupResolver } from "@hookform/resolvers/yup";
import { FC, useEffect, useState } from "react";
import { IScopeTwoElectricity } from "@/types/Accounting";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import useAccountingDataUtils from "@/hooks/useAccountingDataUtils";
import { AppEnumRoutes } from "@/types/AppEnumRoutes";
import HeatAndSteamConfirmModal from "@/components/modals/HeatAndSteamConfirmModal";
import AuthRedirectComponent from "@/components/auth/AuthRedirectComponent";
import useSWR from "swr";
import { IApiEndpoint } from "@/types/Api";
import { swrFetcher } from "@/lib/api-client";

const emissionSources = ["Heat and steam", "Cooling"];
const sourceUnits = ["kwh", "mwh"];

const schema = object({
	date: date().min(getMinDate(), "Date cannot be before 2015-01-01").max(getMaxDate(), "Date cannot be after today"),
	emissionSource: string().required("Emission Source is required"),
	units: string().required("Unit is required"),
	amount: number().required("Amount is required"),
});

interface IProps {
	id: string;
	scopeId: string;
}

const EditHeatAndCoolingData: FC<IProps> = ({ id, scopeId }) => {
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
		setValue,
	} = formMethods;

	const { updateHeatAndCoolingData } = useAccountingDataUtils();
	const router = useRouter();

	const { data: initialData } = useSWR<IScopeTwoElectricity & { date: string }>([IApiEndpoint.GET_SCOPE_TWO_ELECTRICTY_DATA, { id, scopeId }], swrFetcher, { keepPreviousData: true });

	console.log(initialData)

	useEffect(() => {
		if (initialData) {
			setValue("date", initialData.date ? new Date(initialData?.date) : new Date());
			setValue("emissionSource", initialData?.emissionSource);
			setValue("units", initialData?.units);
			setValue("amount", parseFloat(String(initialData?.amount)));
		}
	}, [initialData]);

	const onSubmit = async (data: InferType<typeof schema>) => {
		const { date, emissionSource, units, amount } = data;

		setModalValues({ date: date.toISOString(), emissionSource, units, amount });

		setOpenConfirmModal(true);
	};

	const onConfirm = async () => {
		const dataToSave = {
			...modalValues,
			id,
			scopeId,
		};

		setIsSaving(true);
		const toastId = toast.loading("Updating data...");

		try {
			const resp = await updateHeatAndCoolingData(dataToSave);

			if (resp?.status === "success") {
				toast.success("Data saved successfully", { id: toastId });
				reset();
				setOpenConfirmModal(false);
				router.push(AppEnumRoutes?.APP_DATA_LIST);
			} else {
				toast.error("An error occurred while saving data", { id: toastId });
			}
		} catch (err) {
			toast.error("An error occurred while saving data", { id: toastId });
		} finally {
			setIsSaving(false);
		}
	};

	return (
		<AuthRedirectComponent>
			<Card className="p-6 bg-[#E4FCE6] overflow-y-scroll">
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
							<Button color="primary" startContent={<XIcon size={15} />} variant="bordered" onPress={router.back} >
								Cancel
							</Button>
						</CardFooter>
					</form>
				</FormProvider>
				<HeatAndSteamConfirmModal isOpen={openConfirmModal} setIsOpen={setOpenConfirmModal} values={modalValues} onConfirm={onConfirm} isSaving={isSaving} actionType="update" />
			</Card>
		</AuthRedirectComponent>
	);
};

export default EditHeatAndCoolingData;
