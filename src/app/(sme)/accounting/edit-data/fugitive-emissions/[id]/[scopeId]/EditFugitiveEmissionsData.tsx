"use client";
import { FC, useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import AppInput from "@/components/forms/AppInput";
import { Card, Button, Breadcrumbs, BreadcrumbItem, CardHeader, CardBody, CardFooter, Accordion, AccordionItem } from "@nextui-org/react";
import { Check, XIcon } from "lucide-react";
import AppSelect from "@/components/forms/AppSelect";
import { FaAnglesLeft, FaAnglesRight, FaLeaf } from "react-icons/fa6";
import AppDatePicker from "@/components/buttons/datepicker";
import { generateOptions } from "@/helpers";
import AppCreateableSelect from "@/components/forms/AppCreateableSelect";
import { InferType, array, date, number, object, string } from "yup";
import { getMaxDate, getMinDate } from "@/utils";
import { yupResolver } from "@hookform/resolvers/yup";
import useAccountingDataUtils from "@/hooks/useAccountingDataUtils";
import { IScopeOneFugitiveEmission } from "@/types/Accounting";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { AppEnumRoutes } from "@/types/AppEnumRoutes";
import FugitiveEmissionConfirmModal from "@/components/modals/FugitiveEmissionConfirmModal";
import AuthRedirectComponent from "@/components/auth/AuthRedirectComponent";
import useSWR from "swr";
import { IApiEndpoint } from "@/types/Api";
import { swrFetcher } from "@/lib/api-client";

const fugitiveSources = ["Air Conditioning", "Leakages", "Regrigants"];
const gasesEmitted = ["Carbon", "Methane", "Sulphide OX"];
const units = ["Tonnes", "Litres", "Giga Tonnes"];

function generateAmountKgToUnit(unit: string, val: number) {
	let gasAmountInKg: number;

	switch (unit) {
		case "Tonnes":
			gasAmountInKg = val / 1000;
			break;
		case "Giga Tonnes":
			gasAmountInKg = val / 1e6;
			break;
		case "Litres":
			console.warn("Conversion from Litres to kg requires density information.");
			gasAmountInKg = val;
			break;
		default:
			gasAmountInKg = val;
	}

	return gasAmountInKg;
}

const schema = object({
	date: date().min(getMinDate(), "Date cannot be before 2015-01-01").max(getMaxDate(), "Date cannot be after today"),
	emissionSource: string().required("Emission Source is required"),
	emissionName: array()
		.of(
			object({
				label: string(),
				value: string(),
			})
		)
		.compact((val) => !val.value || val.label === "" || val.value === "")
		.min(1, "Please add at least one equipment name")
		.max(5, "You can only add up to 5 equipment names")
		.required("Please add at least one equipment name"),
	emissionGas: string().required("Emission Gas is required"),
	unit: string().required("Unit is required"),
	gasEmitted: number().required("Gas Emitted is required"),
});

interface IProps {
	id: string;
	scopeId: string;
}

const EditFugitiveEmissionsData: FC<IProps> = ({ id, scopeId }) => {
	const [modalValues, setModalValues] = useState<Omit<IScopeOneFugitiveEmission, "id" | "createdAt" | "updatedAt"> & { date: string }>();
	const [openConfirmModal, setOpenConfirmModal] = useState(false);
	const [isSaving, setIsSaving] = useState(false);

	const formMethods = useForm({
		resolver: yupResolver(schema),
		defaultValues: {
			date: getMaxDate(),
			emissionSource: "",
			emissionName: [],
			emissionGas: "",
			unit: "",
			gasEmitted: 1,
		},
	});

	const {
		handleSubmit,
		control,
		reset,
		formState: { errors },
		setValue,
	} = formMethods;

	const { updateFugitiveEmissionsData } = useAccountingDataUtils();
	const router = useRouter();

	const { data: initialData } = useSWR<IScopeOneFugitiveEmission & { date: string }>([IApiEndpoint.GET_SCOPE_ONE_FUGITIVE_EMISSIONS_DATA, { scopeId }], swrFetcher, { keepPreviousData: true });

	useEffect(() => {
		if (initialData) {
			let amt = generateAmountKgToUnit(initialData?.unit, parseFloat(String(initialData?.gasEmitted)))
			console.log('amt', amt)
			setValue("date", new Date(initialData?.date));
			setValue("gasEmitted", amt);
			setValue("emissionSource", initialData?.emissionSource);
			setValue("emissionGas", initialData?.emissionGas);
			setValue("unit", initialData?.unit);
			setValue("emissionName", initialData?.emissionName ? generateOptions(initialData?.emissionName?.split(",")) : []);
		}
	}, [initialData]);

	const onSubmit = async (data: InferType<typeof schema>) => {
		const { date, emissionSource, emissionName, emissionGas, unit, gasEmitted } = data;

		setModalValues({
			date: date.toISOString(),
			emissionSource,
			emissionName: emissionName.map((item) => item.value).join(", "),
			emissionGas,
			unit,
			gasEmitted,
		});

		setOpenConfirmModal(true);
	};

	const onConfirm = async () => {
		const dataToSave = {
			...modalValues,
			id,
			scopeId,
		};

		setIsSaving(true);
		const toastId = toast.loading("Updating Fugitive Emission...");

		try {
			const resp = await updateFugitiveEmissionsData(dataToSave);

			if (resp?.status === "success") {
				toast.success("Fugitive Emission updated successfully", { id: toastId });
				reset();
				setOpenConfirmModal(false);
				router.push(AppEnumRoutes.APP_DATA_LIST);
			} else {
				toast.error("Failed to update Fugitive Emission", { id: toastId });
			}
		} catch (err) {
			toast.error("Failed to update Fugitive Emission", { id: toastId });
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
						<h1 className="text-xl font-bold">Fugitive Emissions</h1>
						<p className="text-sm">Here you can input data regarding fuel consumption from vehicles under your ownership / control. Whether it's cars, trucks or airplanes.</p>
						<Accordion>
							<AccordionItem
								key="anchor"
								aria-label="Learn More"
								indicator={({ isOpen }) => (isOpen ? <FaAnglesLeft /> : <FaAnglesRight />)}
								title={<span className="text-base text-primary-600 font-semibold">Learn More</span>}>
								<div className="space-y-4">
									<div className="flex space-x-2 items-center">
										<FaLeaf className="w-4 h-4" />
										<p className="text-xs md:text-sm font-medium">Please detail the fugitive sources, gas type and leakage rates</p>
									</div>
									<div className="flex space-x-2 items-center">
										<FaLeaf className="w-4 h-4" />
										<p className="text-xs md:text-sm font-medium">Implement leak detection programs to identify and address fugitive emissions</p>
									</div>
									<div className="flex space-x-2 items-center">
										<FaLeaf className="w-4 h-4" />
										<p className="text-xs md:text-sm font-medium">Maintain records of leak repairs and their impact on emissions</p>
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
								<AppSelect label="Fugitive Sources" options={generateOptions(fugitiveSources)} name="emissionSource" control={control} />
								<AppCreateableSelect label="Equipment Name (s)" placeholder="Type an equipment name" name="emissionName" menuIsOpen={false} control={control} error={errors.emissionName as any} />
								<AppSelect label="Gas Emitted" options={generateOptions(gasesEmitted)} name="emissionGas" control={control} error={errors.emissionGas} />
								<AppSelect label="Unit of Emission" options={generateOptions(units)} name="unit" control={control} error={errors.unit} />
								<AppInput label="Amount of Leakage Gas" name="gasEmitted" type="number" control={control} error={errors.gasEmitted} />
							</div>
						</CardBody>
						<CardFooter className="justify-between md:justify-end gap-5 mt-5 md:mt-10">
							<Button color="primary" startContent={<Check size={15} />} type="submit">
								Calculate
							</Button>
							<Button color="primary" startContent={<XIcon size={15} />} variant="bordered" onClick={router.back} >
								Cancel
							</Button>
						</CardFooter>
					</form>
				</FormProvider>
				<FugitiveEmissionConfirmModal isOpen={openConfirmModal} setIsOpen={setOpenConfirmModal} values={modalValues} onConfirm={onConfirm} isSaving={isSaving} actionType="update" />
			</Card>
		</AuthRedirectComponent>
	);
};

export default EditFugitiveEmissionsData;
