"use client";
import AppDatePicker from "@/components/buttons/datepicker";
import AppInput from "@/components/forms/AppInput";
import AppSelect from "@/components/forms/AppSelect";
import FugitiveEmissionConfirmModal from "@/components/modals/FugitiveEmissionConfirmModal";
import useAccountingDataUtils from "@/hooks/useAccountingDataUtils";
import useDidHydrate from "@/hooks/useDidHydrate";
import { swrFetcher } from "@/lib/api-client";
import { IScopeOneFugitiveEmission } from "@/types/Accounting";
import { IApiEndpoint } from "@/types/Api";
import { AppEnumRoutes } from "@/types/AppEnumRoutes";
import { IProcessingEquipment, ProcessingEquipmentCategory } from "@/types/EquipmentMobility";
import { IOption } from "@/types/Forms";
import { getMaxDate, getMinDate } from "@/utils";
import { yupResolver } from "@hookform/resolvers/yup";
import { BreadcrumbItem, Breadcrumbs, Button, Card, CardBody, CardFooter, CardHeader } from "@nextui-org/react";
import { Check, XIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import useSWR from "swr";
import { date, InferType, number, object, string } from "yup";

type IVariant = "air-conditioning-systems" | "refrigeration-units" | "leak-detection";

interface IProps {
	id: string;
	scopeId: string;
	variant: IVariant;
}

const schema = object({
	date: date().min(getMinDate(), "Date cannot be before 2015-01-01").max(getMaxDate(), "Date cannot be after today"),
	equipment: string().required("Equipment is required"),
	gasEmitted: number().required("Gas Emitted is required"),
});

const dataItemAndDescription: Record<
	IVariant,
	{
		item: string;
		description: string;
	}
> = {
	"air-conditioning-systems": {
		item: "Air Conditioning Systems",
		description: "Track emissions arising from venting, or other air conditioning system.",
	},
	"refrigeration-units": {
		item: "Refrigeration Units",
		description: "Track emissions arising from other fugitive sources such as your refrigeration.",
	},
	"leak-detection": {
		item: "Leak Detection",
		description: "Track emissions arising from other fugitive sources such as your refrigeration.",
	},
};

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

function generateAmountKg(unit: string, val: number) {
	let gasAmountInKg: number;

	switch (unit) {
		case "Tonnes":
			gasAmountInKg = val * 1000;
			break;
		case "Giga Tonnes":
			gasAmountInKg = val * 1e6;
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

const EditFugitiveEmissionsNewData = ({ id, scopeId, variant }: IProps) => {
	const [modalValues, setModalValues] = useState<Omit<IScopeOneFugitiveEmission, "id" | "createdAt" | "updatedAt"> & { date: string }>();
	const [openConfirmModal, setOpenConfirmModal] = useState(false);
	const [isSaving, setIsSaving] = useState(false);
	const { data: session, status } = useSession();
	const { didHydrate } = useDidHydrate();
	const router = useRouter();

	const { updateFugitiveEmissionsData } = useAccountingDataUtils();

	const account = useMemo(() => {
		if (didHydrate && status === "authenticated") {
			return session?.user;
		}

		return null;
	}, [status, didHydrate]);

	const { data: loadedEquipments } = useSWR<IProcessingEquipment[]>(
		!account ? null : [`${IApiEndpoint.PROCESSING_EQUIPMENT_GET_BY_COMPANY_CAT_SUBCAT}/${account?.company?.id}/${ProcessingEquipmentCategory.FUGITIVE}/${variant}`],
		swrFetcher,
		{ keepPreviousData: true }
	);

	const equipmentOptions = useMemo(() => {
		if (loadedEquipments && loadedEquipments?.length) {
			const options = loadedEquipments.map((item) => {
				return {
					label: `${item?.equipmentName} (${item.emissionGasUnit})`,
					value: item.id,
				} satisfies IOption;
			});

			return options;
		}

		return [];
	}, [loadedEquipments]);

	const formMethods = useForm<InferType<typeof schema>>({
		resolver: yupResolver(schema),
		defaultValues: {
			date: getMaxDate(),
			equipment: "",
			gasEmitted: 1,
		},
	});

	const {
		handleSubmit,
		reset,
		control,
		formState: { errors },
		setValue,
	} = formMethods;

	const { data: initialData } = useSWR<IScopeOneFugitiveEmission & { date: string }>([IApiEndpoint.GET_SCOPE_ONE_FUGITIVE_EMISSIONS_DATA, { scopeId }], swrFetcher, { keepPreviousData: true });

	useEffect(() => {
		if (initialData) {
			let amt = generateAmountKgToUnit(initialData?.unit, parseFloat(String(initialData?.gasEmitted)));
			setValue("date", new Date(initialData?.date));
			setValue("gasEmitted", amt);
			if (loadedEquipments && loadedEquipments?.length) {
				let equipmentData = loadedEquipments.find((item) => item?.equipmentName === initialData?.emissionName);
				if (equipmentData) {
					setValue("equipment", equipmentData?.id);
				}
			}
		}
	}, [initialData, loadedEquipments]);

	const onSubmit = handleSubmit(async (data: Required<InferType<typeof schema>>) => {
		const { date, equipment, gasEmitted } = data;

		const equipmentData = loadedEquipments.find((item) => item.id === equipment);

		setModalValues({
			date: date.toISOString(),
			emissionSource: initialData?.emissionSource,
			emissionName: equipmentData?.equipmentName,
			emissionGas: equipmentData?.gasEmitted,
			unit: equipmentData?.emissionGasUnit,
			gasEmitted: generateAmountKg(equipmentData?.emissionGasUnit, gasEmitted),
		});

		setOpenConfirmModal(true);
	});

	const onConfirm = async () => {
		const dataToSave = {
			...modalValues,
			id,
			scopeId,
		};

		setIsSaving(true);
		const toastId = toast.loading(`Updating ${dataItemAndDescription[variant].item} Emissions ...`);

		try {
			const resp = await updateFugitiveEmissionsData(dataToSave);

			if (resp?.status === "success") {
				toast.success(`Updated ${dataItemAndDescription[variant].item} successfully`, { id: toastId });
				reset();
				setOpenConfirmModal(false);
				router.push(AppEnumRoutes.APP_DATA_LIST);
			} else {
				toast.error(`Failed to update ${dataItemAndDescription[variant].item} emissions`, { id: toastId });
			}
		} catch (err) {
			toast.error(`Failed to update ${dataItemAndDescription[variant].item} emissions`, { id: toastId });
		} finally {
			setIsSaving(false);
		}
	};

	return (
		<>
			<Card className="p-6 bg-[#E4FCE6] overflow-y-scroll">
				<CardHeader className="flex flex-col items-start justify-center space-y-4">
					<Breadcrumbs>
						<BreadcrumbItem>Accounting</BreadcrumbItem>
						<BreadcrumbItem href={AppEnumRoutes.APP_DATA_LIST}>Data List</BreadcrumbItem>
						<BreadcrumbItem>Edit Data</BreadcrumbItem>
					</Breadcrumbs>
					<div className="w-full">
						<h1 className="text-xl font-bold">{dataItemAndDescription[variant].item}</h1>
						<p className="text-sm">Here you can input data regarding fuel consumption from vehicles under your ownership / control. Whether it's cars, trucks or airplanes.</p>
					</div>
				</CardHeader>
				<FormProvider {...formMethods}>
					<form onSubmit={onSubmit}>
						<CardBody>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-10">
								<div className="space-y-2">
									<p className="text-sm font-semibold">Select Accounting Period</p>
									<AppDatePicker className="w-full" name="date" control={control} />
									{errors.date && <p className="text-xs text-red-500">{errors.date.message}</p>}
								</div>
								<AppSelect name="equipment" control={control} options={equipmentOptions} error={errors?.equipment} label="Equipment" />
								<AppInput label="Amount of Leakage Gas" name="gasEmitted" type="number" control={control} error={errors.gasEmitted} />
							</div>
						</CardBody>
						<CardFooter className="justify-between md:justify-end gap-5 mt-5 md:mt-10">
							<Button color="primary" startContent={<Check size={15} />} type="submit">
								Calculate
							</Button>
							<Button color="primary" startContent={<XIcon size={15} />} variant="bordered" onClick={router.back}>
								Cancel
							</Button>
						</CardFooter>
					</form>
				</FormProvider>
				<FugitiveEmissionConfirmModal
					isOpen={openConfirmModal}
					setIsOpen={setOpenConfirmModal}
					values={modalValues}
					onConfirm={onConfirm}
					isSaving={isSaving}
					actionType="update"
					customTitle={dataItemAndDescription[variant].item}
				/>
			</Card>
		</>
	);
};

export default EditFugitiveEmissionsNewData;
