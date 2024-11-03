"use client";
import AppDatePicker from "@/components/buttons/datepicker";
import AppInput from "@/components/forms/AppInput";
import AppSelect from "@/components/forms/AppSelect";
import StationaryCombustionConfirmModal from "@/components/modals/StationaryCombustionConfirmModal";
import useAccountingDataUtils from "@/hooks/useAccountingDataUtils";
import useDidHydrate from "@/hooks/useDidHydrate";
import { swrFetcher } from "@/lib/api-client";
import { IScopeOneFuels } from "@/types/Accounting";
import { IApiEndpoint } from "@/types/Api";
import { AppEnumRoutes } from "@/types/AppEnumRoutes";
import { IStationaryEquipment } from "@/types/EquipmentMobility";
import { getMaxDate, getMinDate } from "@/utils";
import { yupResolver } from "@hookform/resolvers/yup";
import { BreadcrumbItem, Breadcrumbs, Button, Card } from "@nextui-org/react";
import { CheckIcon, XIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import useSWR from "swr";
import { date, InferType, number, object, string } from "yup";

type IVariant = "boilers-and-furnaces" | "kitchen-appliances" | "generators" | "heater";

interface IProps {
	id: string;
	scopeId: string;
	variant: IVariant;
}

const dataItemAndDescription: Record<
	IVariant,
	{
		title: string;
		description: string;
	}
> = {
	"boilers-and-furnaces": {
		title: "Boilers & Furnaces",
		description: "Record fuel consumption (e.g. natural gas, oil, propane) by your boilers and furnaces.",
	},
	"kitchen-appliances": {
		title: "Kitchen Appliances",
		description: "Record the emissions of appliances used in your kitchen.",
	},
	generators: {
		title: "Generators",
		description: "Track fuel consumption used by your backup generator.",
	},
	heater: {
		title: "Heater",
		description: "In this section, please enter details of the fuel combustion from heaters.",
	},
};

const schema = object({
	date: date().min(getMinDate(), "Date must be greater than 2015").max(getMaxDate(), "Date must be less than or equal to today"),
	equipment: string().required("Equipment is required").trim(),
	fuelAmount: number().min(1, "Fuel Amount must be greater than 0"),
});

const EditStationaryCombustionNewData = ({ id, scopeId, variant }: IProps) => {
	const { data: session, status } = useSession();
	const { didHydrate } = useDidHydrate();
	const router = useRouter();
	const [modalValues, setModalValues] = useState<Omit<IScopeOneFuels, "id" | "createdAt" | "updatedAt"> & { date: string }>();
	const [openConfirmModal, setOpenConfirmModal] = useState<boolean>(false);
	const [isSaving, setIsSaving] = useState<boolean>(false);

	const formMethods = useForm<InferType<typeof schema>>({
		resolver: yupResolver(schema),
		defaultValues: {
			date: getMaxDate(),
			equipment: "",
			fuelAmount: 1,
		},
	});

	const {
		setValue,
		control,
		handleSubmit,
		formState: { errors },
	} = formMethods;

	const account = useMemo(() => {
		if (didHydrate && status === "authenticated") {
			return session?.user;
		}

		return null;
	}, [status, didHydrate]);

	const { data: loadedEquipments } = useSWR<IStationaryEquipment[]>(!account ? null : [`${IApiEndpoint.GET_STATIONARY_EQUIPMENTS_BY_CATEGORY_AND_COMPANY}/${account?.company?.id}/${variant}`], swrFetcher, {
		keepPreviousData: true,
	});

	const { data: initialData } = useSWR<IScopeOneFuels & { date: string }>([IApiEndpoint.GET_SCOPE_ONE_FUELS_EMISSIONS_DATA, { scopeId }], swrFetcher, { keepPreviousData: true });

	const { queryFuelsInfo, updateFuelEmissionsData } = useAccountingDataUtils();

	const equipmentOptions = useMemo(() => {
		if (loadedEquipments && loadedEquipments?.length) {
			let options = loadedEquipments.map((item) => {
				return {
					label: item.equipmentName,
					value: item.id,
				};
			});

			return options;
		}

		return [];
	}, [loadedEquipments]);

	useEffect(() => {
		if (initialData) {
			setValue("date", new Date(initialData?.date));
			if (loadedEquipments?.length) {
				let equipmentData = loadedEquipments.find((item) => item?.equipmentName === initialData?.equipmentName);
				if (equipmentData) {
					setValue("equipment", equipmentData?.id);
				}
			}
			setValue("fuelAmount", parseFloat(String(initialData?.fuelAmount)));
		}
	}, [initialData, loadedEquipments]);

	const getTotalEmission = async ({ fuelState, fuel, value, unit }: { fuelState: string; fuel: string; value: number; unit: string }) => {
		try {
			const resp = await queryFuelsInfo<{ co2Value: number; _id: null }>({ fuelState, fuel, value, unit });

			if (resp.status === "success") {
				const info = resp.data;
				const zeroArr = info[0];
				if (zeroArr) {
					const co2Value = zeroArr.co2Value;
					return co2Value;
				}

				return 0;
			}

			return 0;
		} catch (err) {
			console.error(err);

			return 0;
		}
	};

	const onSubmit = handleSubmit(async (data: Required<InferType<typeof schema>>) => {
		const equipmentData = loadedEquipments.find((item) => item.id === data.equipment);

		const val = await getTotalEmission({
			fuelState: equipmentData?.fuelState,
			fuel: equipmentData?.fuelType,
			value: data.fuelAmount,
			unit: equipmentData?.fuelUnit,
		});

		setModalValues({
			date: data.date.toISOString(),
			emissionSource: initialData?.emissionSource,
			equipmentName: equipmentData?.equipmentName,
			c02KgEmitted: val.toString(),
			fuelType: equipmentData?.fuelType,
			fuelUnit: equipmentData.fuelUnit,
			fuelAmount: data.fuelAmount,
			fuelState: equipmentData.fuelState,
		});

		setOpenConfirmModal(true);
	});

	const onConfim = async () => {
		const dataToSave = {
			...modalValues,
			id,
			scopeId,
		};

		setIsSaving(true);
		const toastId = toast.loading("Updating Data...");

		try {
			const resp = await updateFuelEmissionsData(dataToSave);

			if (resp?.status === "success") {
				toast.success("Data updated successfully", { id: toastId });
				setOpenConfirmModal(false);
				router.push(AppEnumRoutes.APP_DATA_LIST);
			} else {
				toast.error("Failed to update data", { id: toastId });
			}
		} catch (err) {
			console.error(err);
			toast.error("Failed to update data", { id: toastId });
		} finally {
			setIsSaving(false);
		}
	};

	return (
		<>
			<Card className="p-6 bg-[#E4FCE6] overflow-y-scroll">
				<Breadcrumbs>
					<BreadcrumbItem>Accounting</BreadcrumbItem>
					<BreadcrumbItem href={AppEnumRoutes.APP_DATA_LIST}>Data List</BreadcrumbItem>
					<BreadcrumbItem>Edit Data</BreadcrumbItem>
				</Breadcrumbs>
				<div className="p-4 mt-4">
					<h1 className="text-xl font-bold">{dataItemAndDescription[variant].title}</h1>
					<p className="mt-6">
						In this section, you update the data that has been entered about <span className="lowercase">{dataItemAndDescription[variant].description}</span>
					</p>
				</div>
				<div className="p-4">
					<FormProvider {...formMethods}>
						<form onSubmit={onSubmit}>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div className="space-y-2">
									<p className="text-sm font-semibold">Select Accounting Period</p>
									<AppDatePicker className="w-full" name="date" control={control} />
									{errors.date && <p className="text-red-500 text-sm">{errors.date.message}</p>}
								</div>
								<AppSelect name="equipment" control={control} options={equipmentOptions} error={errors?.equipment} label="Equipment" />
								<AppInput label="Fuel Amount" name="fuelAmount" placeholder="Enter Amount" type="number" control={control} error={errors.fuelAmount} />
							</div>
							<div className="flex items-center justify-end space-x-3 mt-5">
								<Button type="submit" color="primary" startContent={<CheckIcon className="w-4 h-4" />}>
									Continue
								</Button>
								<Button color="primary" variant="bordered" onPress={router.back} startContent={<XIcon className="w-4 h-4" />}>
									Cancel
								</Button>
							</div>
						</form>
					</FormProvider>
					<StationaryCombustionConfirmModal
						isOpen={openConfirmModal}
						setIsOpen={setOpenConfirmModal}
						values={modalValues}
						onConfirm={onConfim}
						isSaving={isSaving}
						actionType="update"
						customTitle={dataItemAndDescription[variant].title}
					/>
				</div>
			</Card>
		</>
	);
};

export default EditStationaryCombustionNewData;
