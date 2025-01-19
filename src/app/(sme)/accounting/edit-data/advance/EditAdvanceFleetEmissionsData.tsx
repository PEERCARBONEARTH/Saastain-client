"use client";
import AppDatePicker from "@/components/buttons/datepicker";
import AppCombobox from "@/components/forms/AppCombobox";
import AppInput from "@/components/forms/AppInput";
import FleetMakeModelEmissionConfirmModal from "@/components/modals/FleetMakeModelEmissionConfirmModal";
import useAccountingDataUtils from "@/hooks/useAccountingDataUtils";
import useEquipmentMobilityUtils from "@/hooks/useEquipmentsMobilityUtils";
import { swrFetcher } from "@/lib/api-client";
import { IScopeOneFleetEmissionsMakeModel } from "@/types/Accounting";
import { IApiEndpoint } from "@/types/Api";
import { AppEnumRoutes } from "@/types/AppEnumRoutes";
import { IOption } from "@/types/Forms";
import { generateOptions, getMaxDate, getMinDate } from "@/utils";
import { yupResolver } from "@hookform/resolvers/yup";
import { BreadcrumbItem, Breadcrumbs, Button, Card } from "@heroui/react";
import { CheckIcon, XIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import useSWR from "swr";
import { date, InferType, object, string } from "yup";

interface IProps {
	id: string;
	scopeId: string;
	variant: "delivery-vehicles" | "passenger-vehicles";
}

const mapVariantToFleetType = (variant: "delivery-vehicles" | "passenger-vehicles") => {
	if (variant === "delivery-vehicles") {
		return "Delivery vehicles";
	} else if (variant === "passenger-vehicles") {
		return "Passenger vehicles";
	}
};

const schema = object({
	date: date().min(getMinDate(), "Date must be after 2015-01-01 and before today's date").max(getMaxDate(), "Date must not be after today"),
	vehicle_make: string().required("Please select a vehicle make"),
	vehicle_model: string().required("Please select a vehicle model"),
	distance_value: string().required("Please enter the distance covered"),
});

const EditAdvanceFleetEmissionsData = ({ id, scopeId, variant }: IProps) => {
	const { data: vehiclesMakesData } = useSWR<{ makes: string[] }>([IApiEndpoint.MOBILITY_QUERY_MAKES], swrFetcher, { keepPreviousData: true });
	const [_models, setModels] = useState<string[]>([]);
	const [modelOptions, setModelOptions] = useState<IOption[]>([]);
	const [modalValues, setModalValues] = useState<Omit<IScopeOneFleetEmissionsMakeModel, "id" | "createdAt" | "updatedAt"> & { date: string }>();
	const [openConfirmModal, setOpenConfirmModal] = useState(false);
	const [isSaving, setIsSaving] = useState(false);

	const router = useRouter();

	const { updateFleetEmissionsData } = useAccountingDataUtils();
	const { getVehicleModelsByMake } = useEquipmentMobilityUtils();

	const { data: initialData } = useSWR<IScopeOneFleetEmissionsMakeModel & { date: string }>([IApiEndpoint.GET_SCOPE_ONE_FLEET_EMISSIONS_DATA, { scopeId }], swrFetcher, { keepPreviousData: true });

	const vehicleMakeOptions = useMemo(() => {
		if (vehiclesMakesData && vehiclesMakesData?.makes?.length) {
			const options = generateOptions(vehiclesMakesData?.makes);

			return options;
		}

		return [];
	}, [vehiclesMakesData]);

	const formMethods = useForm<InferType<typeof schema>>({
		resolver: yupResolver(schema),
		defaultValues: {
			date: getMaxDate(),
			vehicle_make: "",
			vehicle_model: "",
			distance_value: "1",
		},
	});

	const {
		handleSubmit,
		control,
		formState: { errors },
		setValue,
		reset,
		watch,
		resetField,
	} = formMethods;

	const { queryFleetEmissionsByMakeAndModel } = useAccountingDataUtils();

	const getTotalEmissions = async ({ vehicleMake, vehicleModel, distanceCovered }: { vehicleMake: string; vehicleModel: string; distanceCovered: string }) => {
		try {
			const resp = await queryFleetEmissionsByMakeAndModel({ vehicleMake, vehicleModel, distanceCovered });

			if (resp?.status === "success") {
				return { emissions: resp?.data?.co2e_kg, metadata: resp?.data };
			}

			return { emissions: 0, metadata: {} };
		} catch (err) {
			console.error("err:getTotalEmissions", err);
			return { emissions: 0, metadata: {} };
		}
	};

	const onSubmit = handleSubmit(async (data: Required<InferType<typeof schema>>) => {
		const { date, vehicle_make, vehicle_model, distance_value } = data;

		const val = await getTotalEmissions({ vehicleMake: vehicle_make, vehicleModel: vehicle_model, distanceCovered: distance_value });

		setModalValues({
			date: date.toISOString(),
			vehicleMake: vehicle_make,
			vehicleModel: vehicle_model,
			distanceCovered: distance_value,
			c02KgEmitted: val.emissions,
			resultsMetadata: val.metadata as any,
		});

		setOpenConfirmModal(true);
	});

	const onConfirm = async () => {
		const dataToSave = {
			...modalValues,
			scopeId,
			id,
		};

		setIsSaving(true);
		const toastId = toast.loading("Updating data...");

		try {
			const resp = await updateFleetEmissionsData(dataToSave);

			if (resp?.status === "success") {
				toast.success("Data updated successfully", { id: toastId });
				setOpenConfirmModal(false);
				reset();
				router.push("/accounting/data-list");
			} else {
				toast.error("Failed to save data", { id: toastId });
			}
		} catch (err) {
			console.error(err);
			toast.error("Failed to save data", { id: toastId });
		} finally {
			setIsSaving(false);
		}
	};

	const selectedMake = watch("vehicle_make");

	useEffect(() => {
		if (initialData) {
			setValue("date", new Date(initialData?.date));
			setValue("distance_value", initialData?.distanceCovered);
			setValue("vehicle_make", initialData?.vehicleMake);
			setValue("vehicle_model", initialData?.vehicleModel);
		}
	}, [initialData]);

	useEffect(() => {
		async function loadMakeModels() {
			if (!selectedMake) return;

			try {
				const rawResp = await getVehicleModelsByMake(selectedMake);

				if (rawResp.status === "success") {
					setModels(rawResp.data.models);
					resetField("vehicle_model");
					setModelOptions(generateOptions(rawResp.data.models));
					setValue("vehicle_model", rawResp?.data?.models?.[0]);
				}
			} catch (err) {
				console.log("err", err);
			}
		}

		loadMakeModels();
	}, [selectedMake]);

	return (
		<>
			<Card className="p-6 bg-[#E4FCE6] overflow-y-scroll">
				<Breadcrumbs>
					<BreadcrumbItem>Accounting</BreadcrumbItem>
					<BreadcrumbItem href={AppEnumRoutes.APP_DATA_LIST}>Data List</BreadcrumbItem>
					<BreadcrumbItem>Edit Data</BreadcrumbItem>
				</Breadcrumbs>
				<div className="p-4 mt-4">
					<h1 className="text-xl font-bold">Update Fleet Emissions by Make: {mapVariantToFleetType(variant)}</h1>
					<p className="text-[#374151]">
						{variant === "delivery-vehicles" && "Track emissions from vehicles used for company deliveries (e.g., company supplies , notebooks ,pens e.t.c ."}
						{variant === "passenger-vehicles" && "Track emissions from company-owned vehicles used for transporting staff/students."}
					</p>
				</div>
				<div className="p-4">
					<FormProvider {...formMethods}>
						<form onSubmit={onSubmit}>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-10">
								<div className="space-y-2">
									<p className="text-sm font-semibold">Select Accounting Period</p>
									<AppDatePicker className="w-full" name="date" control={control} />
									{errors.date && <p className="text-red-500 text-sm">{errors.date.message}</p>}
								</div>
								<AppCombobox label="Make" options={vehicleMakeOptions} name="vehicle_make" control={control} error={errors?.vehicle_make} />
								<AppCombobox label="Model" options={modelOptions} name="vehicle_model" control={control} error={errors?.vehicle_model} />
								<AppInput label={"Distance Covered"} name="distance_value" control={control} error={errors?.distance_value} placeholder="100" />
							</div>
							<div className="flex items-center justify-end space-x-3 mt-5">
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
				<FleetMakeModelEmissionConfirmModal isOpen={openConfirmModal} setIsOpen={setOpenConfirmModal} values={modalValues} onConfirm={onConfirm} isSaving={isSaving} actionType="update" />
			</Card>
		</>
	);
};

export default EditAdvanceFleetEmissionsData;
