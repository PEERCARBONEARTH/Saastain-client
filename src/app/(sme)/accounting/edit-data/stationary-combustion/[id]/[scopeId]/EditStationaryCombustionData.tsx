"use client";
import { useForm, FormProvider } from "react-hook-form";
import AppInput from "@/components/forms/AppInput";
import { Card, Spacer, Button, Breadcrumbs, BreadcrumbItem, Accordion, AccordionItem } from "@heroui/react";
import { CheckIcon, XIcon } from "lucide-react";
import AppSelect from "@/components/forms/AppSelect";
import { FaAnglesRight, FaAnglesLeft, FaLeaf } from "react-icons/fa6";
import AppDatePicker from "@/components/buttons/datepicker";
import { generateOptions } from "@/helpers";
import { useEquipmentsStore } from "@/hooks/store/useEquipmentsStore";
import AppCreateableSelect from "@/components/forms/AppCreateableSelect";
import useAccountingDataUtils from "@/hooks/useAccountingDataUtils";
import { FC, useEffect, useState } from "react";
import { IScopeOneFuels, IScopeOneQueryFuelResponse1 } from "@/types/Accounting";
import { IOption } from "@/types/Forms";
import { InferType, date, number, object, string } from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import toast from "react-hot-toast";
import StationaryCombustionConfirmModal from "@/components/modals/StationaryCombustionConfirmModal";
import { useRouter } from "next/navigation";
import { AppEnumRoutes } from "@/types/AppEnumRoutes";
import { getMaxDate, getMinDate } from "@/utils";
import AuthRedirectComponent from "@/components/auth/AuthRedirectComponent";
import useSWR from "swr";
import { IApiEndpoint } from "@/types/Api";
import { swrFetcher } from "@/lib/api-client";

const fuelStates = ["Gaseous fuels", "Solid fuels", "Liquid fuels"];
const emissionSources = ["Boilers", "Generators", "Heaters"];

const schema = object({
	date: date().min(getMinDate(), "Date must be greater than 2015").max(getMaxDate(), "Date must be less than or equal to today"),
	emissionSource: string().required("Emission Source is required").trim(),
	equipmentName: object().shape({
		value: string().required("Equipment Name is required").trim(),
		label: string().required("Equipment Name is required").trim(),
	}),
	fuelType: string().required("Fuel Type is required").trim(),
	fuelUnit: string().required("Fuel Unit is required").trim(),
	fuelAmount: number().min(1, "Fuel Amount must be greater than 0"),
	fuelState: string().required("Fuel State is required").trim(),
});

interface IProps {
	id: string;
	scopeId: string;
}

const EditStationaryCombustionData: FC<IProps> = ({ id, scopeId }) => {
	const equipments = useEquipmentsStore((state) => state.equipments);
	const addEquipment = useEquipmentsStore((state) => state.addEquipment);

	const [dbFuelTypes, setDbFuelTypes] = useState<IOption[]>([]);
	const [queryOne1Fuel, setQueryOne1Fuel] = useState<IScopeOneQueryFuelResponse1[]>([]);
	const [units, setUnits] = useState<any>();
	const [openConfirmModal, setOpenConfirmModal] = useState<boolean>(false);
	const [modalValues, setModalValues] = useState<Omit<IScopeOneFuels, "id" | "createdAt" | "updatedAt"> & { date: string }>();
	const [isSaving, setIsSaving] = useState<boolean>(false);
	// define the form
	const formMethods = useForm<InferType<typeof schema>>({
		defaultValues: {
			date: getMaxDate(),
			emissionSource: "",
			equipmentName: { value: "", label: "" },
			fuelType: "",
			fuelUnit: "",
			fuelAmount: 1,
			fuelState: "",
		},
		resolver: yupResolver(schema),
	});

	const {
		setValue,
		watch,
		control,
		handleSubmit,
		formState: { errors },
		resetField,
		getValues,
	} = formMethods;

	const { queryFuelsInfo, updateFuelEmissionsData } = useAccountingDataUtils();
	const router = useRouter();

	const currentFuelState = watch("fuelState");

	const { data: initialData } = useSWR<IScopeOneFuels & { date: string }>([IApiEndpoint.GET_SCOPE_ONE_FUELS_EMISSIONS_DATA, { scopeId }], swrFetcher, { keepPreviousData: true });

	useEffect(() => {
		if (initialData) {
			setValue("date", new Date(initialData?.date));
			setValue("fuelState", initialData?.fuelState);
			setValue("fuelAmount", parseFloat(String(initialData?.fuelAmount)));
			setValue("equipmentName", { label: initialData?.equipmentName, value: initialData?.equipmentName });
			setValue("emissionSource", initialData?.emissionSource);
		}
	}, [initialData]);

	useEffect(() => {
		async function loadFuelStates() {
			if (!currentFuelState) return;
			try {
				const resp = await queryFuelsInfo({ fuelState: currentFuelState });

				if (resp.status === "success") {
					resetField("fuelType");
					// clear the fuel types
					setDbFuelTypes([]);
					// clear the fuel unit
					resetField("fuelUnit");
					const info = resp.data;
					if (Array.isArray(info)) {
						// map the response to the state and remove __v and _id
						const mapped = info.map(({ __v, _id, ...rest }) => rest);
						setQueryOne1Fuel(mapped);
						// set the fuel types
						const fuelTypes = mapped.map((item) => item.fuel);
						setDbFuelTypes(generateOptions(fuelTypes));
					}
				}
			} catch (err) {
				console.error(err);
			}
		}

		loadFuelStates();
	}, [currentFuelState]);

	const onSelectedFuelType = async () => {
		// deselect the fuel unit
		setValue("fuelUnit", "");
		try {
			const selectedFuel = queryOne1Fuel.find((item) => item.fuel === getValues("fuelType"));
			if (selectedFuel) {
				const units = selectedFuel.unit;
				setUnits(units);
				setValue("fuelUnit", units);
			}
		} catch (err) {
			console.error(err);
		}
	};

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

	const onSubmit = async (data: InferType<typeof schema>) => {
		const val = await getTotalEmission({
			fuelState: data.fuelState,
			fuel: data.fuelType,
			value: data.fuelAmount,
			unit: data.fuelUnit,
		});

		setModalValues({
			date: data.date.toISOString(),
			emissionSource: data.emissionSource,
			equipmentName: data.equipmentName.value,
			c02KgEmitted: val.toString(),
			fuelType: data.fuelType,
			fuelUnit: data.fuelUnit,
			fuelAmount: data.fuelAmount,
			fuelState: data.fuelState,
		});

		setOpenConfirmModal(true);
	};

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

	useEffect(() => {
		if (initialData && dbFuelTypes) {
			setValue("fuelType", initialData?.fuelType);
			onSelectedFuelType();
		}
	}, [initialData, dbFuelTypes]);

	return (
		<AuthRedirectComponent>
			<Card className="p-6 bg-[#E4FCE6] overflow-y-scroll">
				<Breadcrumbs>
					<BreadcrumbItem>Accounting</BreadcrumbItem>
					<BreadcrumbItem>Add Data</BreadcrumbItem>
				</Breadcrumbs>
				<div className="p-4 mt-4">
					<h1 className="text-xl font-bold">Stationary Combustion</h1>
					<p className="mt-6">In this section, please enter details of the fuel combustion from owned / controlled sources. This section includes equipment like boilers , generators and heaters.</p>
					<Accordion>
						<AccordionItem
							key="anchor"
							aria-label="Learn More"
							indicator={({ isOpen }) => (isOpen ? <FaAnglesLeft /> : <FaAnglesRight />)}
							title={<span className="text-base text-primary-600 font-semibold">Learn More</span>}>
							<div className="space-y-4">
								<div className="flex space-x-2 items-center">
									<FaLeaf className="w-6 h-6" />
									<p className="text-xs md:text-sm font-medium">By providing accurate information on the fuel types & consumption rates will help calculate the emissions</p>
								</div>
								<div className="flex space-x-2 items-center">
									<FaLeaf className="w-6 h-6" />
									<p className="text-xs md:text-sm font-medium">Consider integrating monitoring systems. Regularly updating operation data can lead to more accurate emission estimates</p>
								</div>
								<div className="flex space-x-2 items-center">
									<FaLeaf className="w-6 h-6" />
									<p className="text-xs md:text-sm font-medium">If you use a variety of fuels, enter each fuel separately</p>
								</div>
							</div>
						</AccordionItem>
					</Accordion>
				</div>
				<div className="p-4">
					<FormProvider {...formMethods}>
						<form onSubmit={handleSubmit(onSubmit)}>
							<div className="space-y-2">
								<p className="text-sm font-semibold">Select Accounting Period</p>
								<AppDatePicker className="w-full" name="date" control={control} />
								{errors.date && <p className="text-red-500 text-sm">{errors.date.message}</p>}
							</div>
							<Spacer y={6} />
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<AppSelect options={generateOptions(fuelStates)} label="Fuel State" name="fuelState" placeholder="Select One" control={control} error={errors.fuelState} />
								<AppSelect label="Fuel Type" name="fuelType" placeholder="Select One" options={dbFuelTypes} control={control} onSelectAction={onSelectedFuelType} error={errors.fuelType} />
								<AppSelect name="emissionSource" label="Emission Source" control={control} options={generateOptions(emissionSources)} placeholder="Select Source" error={errors.emissionSource} />
								<AppCreateableSelect
									name="equipmentName"
									label="Equipment Name"
									options={generateOptions(equipments)}
									onCreate={addEquipment}
									isMulti={false}
									placeholder="Pick / Type One"
									control={control}
									error={errors.equipmentName}
								/>
								<AppSelect label="Fuel Unit" name="fuelUnit" options={generateOptions([units])} placeholder="Select One" control={control} error={errors.fuelUnit} />
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
				</div>
				<StationaryCombustionConfirmModal isOpen={openConfirmModal} setIsOpen={setOpenConfirmModal} values={modalValues} onConfirm={onConfim} isSaving={isSaving} actionType="update" />
			</Card>
		</AuthRedirectComponent>
	);
};

export default EditStationaryCombustionData;
