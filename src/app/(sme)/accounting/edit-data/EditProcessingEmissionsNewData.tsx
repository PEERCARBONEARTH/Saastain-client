"use client";

import AppDatePicker from "@/components/buttons/datepicker";
import AppInput from "@/components/forms/AppInput";
import AppSelect from "@/components/forms/AppSelect";
import ProcessEmissionConfirmModal from "@/components/modals/ProcessEmissionConfirmModal";
import useAccountingDataUtils from "@/hooks/useAccountingDataUtils";
import useDidHydrate from "@/hooks/useDidHydrate";
import { swrFetcher } from "@/lib/api-client";
import { IScopeOneProcessEmission } from "@/types/Accounting";
import { IApiEndpoint } from "@/types/Api";
import { AppEnumRoutes } from "@/types/AppEnumRoutes";
import { IProcessingEquipment, ProcessingEquipmentCategory } from "@/types/EquipmentMobility";
import { IOption } from "@/types/Forms";
import { ProcessingEmissionAddVariant } from "@/types/ProcessingAndFugitive";
import { getMaxDate, getMinDate } from "@/utils";
import { yupResolver } from "@hookform/resolvers/yup";
import { BreadcrumbItem, Breadcrumbs, Button, Card, CardHeader } from "@nextui-org/react";
import { CheckIcon, XIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import useSWR from "swr";
import { date, InferType, number, object, string } from "yup";

const schema = object({
	date: date().min(getMinDate(), "Date cannot be before 2015-01-01").max(getMaxDate(), "Date cannot be after today"),
	equipment: string().required("Equipment is required"),
	gasAmount: number().required("Gas Amount is required"),
});

interface IProps {
	id: string;
	scopeId: string;
	variant: ProcessingEmissionAddVariant;
}

const dataItemAndDescription = {
	[ProcessingEmissionAddVariant.CHEMICAL_REACTIONS]: {
		title: "Chemical Reactions",
		description: "Record emissions data associated with processing activities and chemical reactions in your processes.",
	},
	[ProcessingEmissionAddVariant.INDUSTRIAL_EQUIPMENTS]: {
		title: "Industrial Equipments",
		description: "Record emissions data associated with industrial activities in your processes.",
	},
};

const EditProcessingEmissionsNewData = ({ id, scopeId, variant }: IProps) => {
	const { data: session, status } = useSession();
	const { didHydrate } = useDidHydrate();
	const router = useRouter();
	const [modalValues, setModalValues] = useState<Omit<IScopeOneProcessEmission, "id" | "createdAt" | "updatedAt"> & { date: string }>();
	const [openConfirmModal, setOpenConfirmModal] = useState(false);
	const [isSaving, setIsSaving] = useState(false);

	const account = useMemo(() => {
		if (didHydrate && status === "authenticated") {
			return session?.user;
		}

		return null;
	}, [status, didHydrate]);

	const { data: loadedEquipments } = useSWR<IProcessingEquipment[]>(
		!account ? null : [`${IApiEndpoint.PROCESSING_EQUIPMENT_GET_BY_COMPANY_CAT_SUBCAT}/${account?.company?.id}/${ProcessingEquipmentCategory.PROCESSING}/${variant}`],
		swrFetcher,
		{ keepPreviousData: true }
	);

	const equipmentOptions = useMemo(() => {
		if (loadedEquipments && loadedEquipments?.length) {
			const options = loadedEquipments.map((item) => {
				return {
					label: item.equipmentName,
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
			gasAmount: 1,
		},
	});

	const {
		handleSubmit,
		control,
		setValue,
		formState: { errors },
		reset,
	} = formMethods;

	const { data: initialData } = useSWR<IScopeOneProcessEmission & { date: string }>([IApiEndpoint.GET_SCOPE_ONE_PROCESS_EMISSIONS_DATA, { scopeId }], swrFetcher, { keepPreviousData: true });

	const { updateProcessingEmissionsData } = useAccountingDataUtils();

	useEffect(() => {
		setValue("date", new Date(initialData?.date));
		if (loadedEquipments?.length) {
			let equipmentData = loadedEquipments.find((item) => item?.equipmentName === initialData?.emissionName);
			if (equipmentData) {
				setValue("equipment", equipmentData?.id);
			}
		}
		setValue("gasAmount", parseFloat(String(initialData?.gasAmount)));
	}, [initialData, loadedEquipments]);

	const onSubmit = handleSubmit(async (data: Required<InferType<typeof schema>>) => {
		const { date, equipment, gasAmount } = data;

		const equipmentData = loadedEquipments.find((item) => item.id === equipment);

		setModalValues({
			date: date.toISOString(),
			emissionSource: initialData?.emissionSource,
			emissionName: equipmentData?.equipmentName,
			wasteGas: equipmentData?.gasEmitted,
			unit: equipmentData?.emissionGasUnit,
			gasAmount,
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

		const toastId = toast.loading(`Updating ${dataItemAndDescription[variant].title} emissions data ...`);

		try {
			const resp = await updateProcessingEmissionsData(dataToSave);

			if (resp?.status === "success") {
				toast.success(dataItemAndDescription[variant].title + " updated successfully", { id: toastId });
				reset();
				setOpenConfirmModal(false);
				router.push(AppEnumRoutes.APP_DATA_LIST);
			} else {
				console.log(resp);
				toast.error("Failed to update " + dataItemAndDescription[variant].title, { id: toastId });
			}
		} catch (err) {
			console.error(err);
			toast.error("Failed to update " + dataItemAndDescription[variant].title, { id: toastId });
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
						<h1 className="text-xl font-bold">{dataItemAndDescription[variant].title}</h1>
						<p className="text-sm">This section is dedicated to editting chemical reactions</p>
					</div>
				</CardHeader>
				<div className="px-4 py-5">
					<FormProvider {...formMethods}>
						<form onSubmit={onSubmit}>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div className="space-y-2">
									<p className="text-sm font-semibold">Select Accounting Period</p>
									<AppDatePicker name="date" className="w-full" control={control} />
									{errors.date && <p className="text-xs text-red-500">{errors.date.message}</p>}
								</div>
								<AppSelect name="equipment" control={control} options={equipmentOptions} error={errors?.equipment} label="Equipment" />
								<AppInput label="Gas Amount" type="number" name="gasAmount" control={control} error={errors.gasAmount} />
							</div>
							<div className="flex items-center justify-end space-x-3 mt-5 md:mt-10">
								<Button color="primary" startContent={<CheckIcon className="w-4 h-4" />} type="submit">
									Continue
								</Button>
								<Button color="primary" variant="bordered" startContent={<XIcon className="w-4 h-4" />} type="button" onPress={router.back}>
									Cancel
								</Button>
							</div>
						</form>
					</FormProvider>
				</div>
				<ProcessEmissionConfirmModal isOpen={openConfirmModal} setIsOpen={setOpenConfirmModal} values={modalValues} onConfirm={onConfirm} isSaving={isSaving} actionType="update" />
			</Card>
		</>
	);
};

export default EditProcessingEmissionsNewData;
