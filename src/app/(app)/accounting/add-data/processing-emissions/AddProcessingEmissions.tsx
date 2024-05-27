"use client";
import { useForm, FormProvider } from "react-hook-form";
import AppInput from "@/components/forms/AppInput";
import { Card, Button, Breadcrumbs, BreadcrumbItem, Accordion, AccordionItem, CardHeader } from "@nextui-org/react";
import { CheckIcon, XIcon } from "lucide-react";
import AppSelect from "@/components/forms/AppSelect";
import { FaAnglesRight, FaAnglesLeft, FaLeaf } from "react-icons/fa6";
import AppDatePicker from "@/components/buttons/datepicker";
import { generateOptions } from "@/helpers";
import { useEquipmentsStore } from "@/hooks/store/useEquipmentsStore";
import AppCreateableSelect from "@/components/forms/AppCreateableSelect";
import { useRouter } from "next/navigation";
import { InferType, date, number, object, string } from "yup";
import { getMaxDate, getMinDate } from "@/utils";
import { yupResolver } from "@hookform/resolvers/yup";
import useAccountingDataUtils from "@/hooks/useAccountingDataUtils";
import { useMemo, useState } from "react";
import { IScopeOneProcessEmission } from "@/types/Accounting";
import { useSession } from "next-auth/react";
import useDidHydrate from "@/hooks/useDidHydrate";
import toast from "react-hot-toast";
import { AppEnumRoutes } from "@/types/AppEnumRoutes";
import ProcessEmissionConfirmModal from "@/components/modals/ProcessEmissionConfirmModal";
import AuthRedirectComponent from "@/components/auth/AuthRedirectComponent";

const emissionSources = ["Chemical Reactions", "Industrial Equipment", "Processing Emissions"];
const wasteGases = ["Carbon", "Methane", "Sulphide OX"];
const wasteGasUnit = ["Tonnes", "Litres", "Giga Tonnes"];

const schema = object({
	date: date().min(getMinDate(), "Date cannot be before 2015-01-01").max(getMaxDate(), "Date cannot be after today"),
	emissionSource: string().required("Emission Source is required"),
	equipmentName: object().shape({
		value: string().required("Equipment Name is required").trim(),
		label: string().required("Equipment Name is required").trim(),
	}),
	wasteGas: string().required("Waste Gas is required"),
	unit: string().required("Waste Gas Unit is required"),
	gasAmount: number().required("Gas Amount is required"),
});

const ProcessEmission = () => {
	const equipments = useEquipmentsStore((state) => state.equipments);
	const addEquipment = useEquipmentsStore((state) => state.addEquipment);
	const [modalValues, setModalValues] = useState<Omit<IScopeOneProcessEmission, "id" | "createdAt" | "updatedAt"> & { date: string }>();
	const [openConfirmModal, setOpenConfirmModal] = useState(false);
	const [isSaving, setIsSaving] = useState(false);

	const formMethods = useForm<InferType<typeof schema>>({
		resolver: yupResolver(schema),
		defaultValues: {
			date: getMaxDate(),
			emissionSource: "",
			equipmentName: { value: "", label: "" },
			wasteGas: "",
			unit: "",
			gasAmount: 1,
		},
	});

	const {
		handleSubmit,
		control,
		reset,
		formState: { errors },
	} = formMethods;

	const { saveProcessEmission } = useAccountingDataUtils();
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
		const { date, emissionSource, equipmentName, wasteGas, unit, gasAmount } = data;

		setModalValues({
			date: date.toISOString(),
			emissionSource,
			emissionName: equipmentName.value,
			wasteGas,
			unit,
			gasAmount,
		});

		setOpenConfirmModal(true);
	};

	const onConfirm = async () => {
		const dataToSave = {
			...modalValues,
			CompanyId: account?.company?.id,
		};

		setIsSaving(true);

		const id = toast.loading("Saving Process Emission...");

		try {
			const resp = await saveProcessEmission(dataToSave);

			if (resp?.status === "success") {
				toast.success("Process Emission saved successfully", { id });
				reset();
				setOpenConfirmModal(false);
				router.push(AppEnumRoutes.APP_DATA_LIST);
			} else {
				console.log(resp);
				toast.error("Failed to save Process Emission", { id });
			}
		} catch (err) {
			console.error(err);
			toast.error("Failed to save Process Emission", { id });
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
						<h1 className="text-xl font-bold">Process Emissions</h1>
						<p className="text-sm">This section is dedicated to data related to emissions from specific industrial processes.</p>
						<Accordion>
							<AccordionItem
								key="anchor"
								aria-label="Learn More"
								indicator={({ isOpen }) => (isOpen ? <FaAnglesLeft /> : <FaAnglesRight />)}
								title={<span className="text-base text-primary-600 font-semibold">Learn More</span>}>
								<div className="space-y-4">
									<div className="flex space-x-2 items-center">
										<FaLeaf className="w-4 h-4" />
										<p className="text-xs md:text-sm font-medium">By providing accurate information on the fuel types & consumption rates will help calculate the emissions</p>
									</div>
									<div className="flex space-x-2 items-center">
										<FaLeaf className="w-4 h-4" />
										<p className="text-xs md:text-sm font-medium">Consider integrating monitoring systems. Regularly updating operation data can lead to more accurate emission estimates</p>
									</div>
									<div className="flex space-x-2 items-center">
										<FaLeaf className="w-4 h-4" />
										<p className="text-xs md:text-sm font-medium">If you use a variety of fuels, enter each fuel separately</p>
									</div>
								</div>
							</AccordionItem>
						</Accordion>
					</div>
				</CardHeader>
				<div className="px-4 py-5">
					<FormProvider {...formMethods}>
						<form onSubmit={handleSubmit(onSubmit)}>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-10 mt-5">
								<div className="space-y-2">
									<p className="text-sm font-semibold">Select Accounting Period</p>
									<AppDatePicker name="date" className="w-full" control={control} />
									{errors.date && <p className="text-xs text-red-500">{errors.date.message}</p>}
								</div>
								<AppSelect label="Emission Source" options={generateOptions(emissionSources)} name="emissionSource" control={control} error={errors.emissionSource} />
								<AppCreateableSelect
									label="Equipment Name"
									options={generateOptions(equipments)}
									onCreate={addEquipment}
									isMulti={false}
									placeholder="Pick / Type One"
									name="equipmentName"
									control={control}
									error={errors.equipmentName}
									menuIsOpen={false}
								/>
								<AppSelect label="Waste Gas" options={generateOptions(wasteGases)} name="wasteGas" control={control} error={errors.wasteGas} />
								<AppSelect label="Waste Gas Unit" options={generateOptions(wasteGasUnit)} name="unit" control={control} error={errors.unit} />
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
				<ProcessEmissionConfirmModal isOpen={openConfirmModal} setIsOpen={setOpenConfirmModal} values={modalValues} onConfirm={onConfirm} isSaving={isSaving} />
			</Card>
		</AuthRedirectComponent>
	);
};

export default ProcessEmission;
