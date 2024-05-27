"use client";
import { useForm, FormProvider } from "react-hook-form";
import AppInput from "@/components/forms/AppInput";
import { Card, Button, Breadcrumbs, BreadcrumbItem, CardHeader, CardBody, CardFooter, Accordion, AccordionItem } from "@nextui-org/react";
import { Check, XIcon } from "lucide-react";
import AppSelect from "@/components/forms/AppSelect";
import { FaAnglesLeft, FaAnglesRight, FaLeaf } from "react-icons/fa6";
import AppDatePicker from "@/components/buttons/datepicker";
import { generateOptions } from "@/helpers";
import { worldCountries } from "@/data/world-countries";
import { InferType, date, number, object, string } from "yup";
import { getMinDate, getMaxDate } from "@/utils";
import { yupResolver } from "@hookform/resolvers/yup";
import useAccountingDataUtils from "@/hooks/useAccountingDataUtils";
import { useEffect, useMemo, useState } from "react";
import { IOption } from "@/types/Forms";
import { IScopeTwoElectricity } from "@/types/Accounting";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import useDidHydrate from "@/hooks/useDidHydrate";
import toast from "react-hot-toast";
import { AppEnumRoutes } from "@/types/AppEnumRoutes";
import ElectricityConfirmModal from "@/components/modals/ElectricityConfirmModal";
import AuthRedirectComponent from "@/components/auth/AuthRedirectComponent";

const isRenewableOptions = ["Yes", "No"];

const schema = object({
	date: date().min(getMinDate(), "Date must be after 2015-01-01 and before today's date").max(getMaxDate(), "Date must not be after today"),
	country: string().required("Please select a country"),
	emissionSource: string().required("Please select an emission source"),
	isRenewable: string().required("Please select an option"),
	units: string().required("Please select a unit"),
	amount: number().required("Please enter the amount of emissions"),
});

const AddElectricityData = () => {
	const [loadedEmissionSources, setLoadedEmissionSources] = useState<IOption[]>([]);
	const [loadedUnits, setLoadedUnits] = useState<IOption[]>([]);
	const [modalValues, setModalValues] = useState<Omit<IScopeTwoElectricity, "id" | "createdAt" | "updatedAt"> & { date: string; isRenewable: string; country: string }>();
	const [openConfirmModal, setOpenConfirmModal] = useState(false);
	const [isSaving, setIsSaving] = useState(false);

	const formMethods = useForm({
		resolver: yupResolver(schema),
		defaultValues: {
			date: getMaxDate(),
			country: "Kenya",
			emissionSource: "",
			isRenewable: "No",
			units: "",
			amount: 1,
		},
	});

	const router = useRouter();
	const { status, data: session } = useSession();
	const { didHydrate } = useDidHydrate();

	const {
		handleSubmit,
		reset,
		control,
		formState: { errors },
		watch,
	} = formMethods;

	const { queryElectricityInfo, saveElectricityInfo } = useAccountingDataUtils();

	const account = useMemo(() => {
		if (didHydrate && status === "authenticated") {
			return session?.user;
		}

		return null;
	}, [status, didHydrate]);

	useEffect(() => {
		async function loadEmissionSources() {
			try {
				const resp = await queryElectricityInfo({});
				if (resp.status === "success") {
					const info = resp.data as string[];
					if (Array.isArray(info)) {
						const options = generateOptions(info);
						setLoadedEmissionSources(options);
					}
				}
			} catch (error) {
				console.error("Error loading emission sources", error);
			}
		}

		loadEmissionSources();
	}, []);

	const currentCountry = watch("country");
	const currentEmissionSource = watch("emissionSource");

	useEffect(() => {
		async function loadUnits() {
			if (!currentCountry || !currentEmissionSource) return;

			try {
				const resp = await queryElectricityInfo({ country: currentCountry, EmissionSource: currentEmissionSource });

				if (resp.status === "success") {
					const info = resp.data as {
						EmissionSource: string;
						country: string;
						factors: number;
						isRenewable: boolean;
						unit: string;
					}[];

					// load a unique list of units
					const units = info.map((item) => item.unit);
					const uniqueUnits = [...new Set(units)];
					setLoadedUnits(generateOptions(uniqueUnits));
				}
			} catch (err) {}
		}

		loadUnits();
	}, [currentCountry, currentEmissionSource]);

	const getTotalEmissions = async ({ EmissionSource, country, unit, value, isRenewable }: { EmissionSource: string; country: string; unit: string; value: number; isRenewable: boolean }) => {
		try {
			const resp = await queryElectricityInfo({ EmissionSource, country, unit, value, isRenewable });

			if (resp.status === "success") {
				const info = resp.data as { totalEmissions: number; _id: null }[];
				const zeroArr = info?.[0];

				if (zeroArr) {
					const c02Value = zeroArr?.totalEmissions;
					return c02Value;
				}

				return 0;
			}

			return 0;
		} catch (err) {
			console.error("Error getting total emissions", err);
			return 0;
		}
	};

	const onSubmit = async (data: InferType<typeof schema>) => {
		const { date, emissionSource, units, amount, isRenewable } = data;

		const value = await getTotalEmissions({ EmissionSource: emissionSource, country: data.country, unit: units, value: amount, isRenewable: false });

		setModalValues({ date: date.toISOString(), emissionSource, units, amount, isRenewable, country: data.country, totalEmissions: value });

		setOpenConfirmModal(true);
	};

	const onConfirm = async () => {
		const dataToSave = {
			date: modalValues?.date,
			emissionSource: modalValues?.emissionSource,
			units: modalValues?.units,
			amount: modalValues?.amount,
			totalEmissions: modalValues?.totalEmissions,
			CompanyId: account?.company?.id,
		};

		setIsSaving(true);
		const id = toast.loading("Saving data...");

		try {
			const resp = await saveElectricityInfo(dataToSave);

			if (resp?.status === "success") {
				toast.success("Data saved successfully", { id });
				reset();
				setOpenConfirmModal(false);
				router.push(AppEnumRoutes.APP_DATA_LIST);
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
			<Card className="p-10 bg-[#E4FCE6] overflow-y-scroll">
				<CardHeader className="flex flex-col items-start justify-center space-y-4">
					<Breadcrumbs>
						<BreadcrumbItem>Accounting</BreadcrumbItem>
						<BreadcrumbItem>Add Data</BreadcrumbItem>
					</Breadcrumbs>
					<div className="w-full">
						<h1 className="text-xl font-bold">Electricity Consumption</h1>
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
								<AppSelect label="Your Country" options={generateOptions(worldCountries)} name="country" control={control} error={errors.country} />
								<AppSelect label="Emission Source" options={loadedEmissionSources} name="emissionSource" control={control} error={errors.emissionSource} />
								<AppSelect label="Is the electricity from renewable sources?" options={generateOptions(isRenewableOptions)} name="isRenewable" control={control} error={errors.isRenewable} />
								<AppSelect label="Unit" options={loadedUnits.length === 0 ? generateOptions(["kwh"]) : loadedUnits} name="units" control={control} error={errors.units} />
								<AppInput label="Amount of Emissions" type="number" name="amount" control={control} error={errors.amount} />
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
				<ElectricityConfirmModal isOpen={openConfirmModal} setIsOpen={setOpenConfirmModal} values={modalValues} onConfirm={onConfirm} isSaving={isSaving} />
			</Card>
		</AuthRedirectComponent>
	);
};

export default AddElectricityData;
