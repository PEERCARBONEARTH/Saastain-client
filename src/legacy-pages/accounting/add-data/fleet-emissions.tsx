import AppLayout from "@/layouts/AppLayout";
import { NextPageWithLayout } from "@/types/Layout";
import { useForm, FormProvider } from "react-hook-form";
import { Card, Button, Breadcrumbs, BreadcrumbItem, Accordion, AccordionItem } from "@nextui-org/react";
import { CheckIcon, XIcon } from "lucide-react";
import { FaAnglesRight, FaAnglesLeft, FaLeaf } from "react-icons/fa6";
import Head from "next/head";
import AppDatePicker from "@/components/buttons/datepicker";
import AppSelect from "@/components/forms/AppSelect";
import { generateOptions } from "@/helpers";
import AppInput from "@/components/forms/AppInput";
import { useEffect, useMemo, useState } from "react";
import { IOption } from "@/types/Forms";
import useAccountingDataUtils from "@/hooks/useAccountingDataUtils";
import { InferType, date, number, object, string } from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { IScopeOneFleet } from "@/types/Accounting";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import useDidHydrate from "@/hooks/useDidHydrate";
import toast from "react-hot-toast";
import FleetEmissionConfirmModal from "@/components/modals/FleetEmissionConfirmModal";
import { getMaxDate, getMinDate } from "@/utils";
import AuthRedirectComponent from "@/components/auth/AuthRedirectComponent";

const schema = object({
	date: date().min(getMinDate(), "Date must be after 2015-01-01 and before today's date").max(getMaxDate(), "Date must not be after today"),
	fleetType: string().required("Please select a fleet type"),
	fleetCategory: string().required("Please select a fleet category"),
	typeOfFuel: string().required("Please select a type of fuel"),
	unitOfDistance: string().required("Please select a unit of distance"),
	amountOfDistance: number().required("Please enter the amount of distance covered").min(0, "Distance must be greater than 0"),
});

const FleetEmissions: NextPageWithLayout = () => {
	// define the form
	const formMethods = useForm<InferType<typeof schema>>({
		defaultValues: {
			date: getMaxDate(),
			fleetType: "",
			fleetCategory: "",
			typeOfFuel: "",
			unitOfDistance: "",
			amountOfDistance: 1,
		},
		resolver: yupResolver(schema),
	});
	const [loadedFleetTypes, setLoadedFleetTypes] = useState<IOption[]>([]);
	const [loadedFleetCategories, setLoadedFleetCategories] = useState<IOption[]>([]);
	const [loadedTypeOfFuels, setLoadedTypeOfFuels] = useState<IOption[]>([]);
	const [loadedUnitOfDistance, setLoadedUnitOfDistance] = useState<IOption[]>([]);
	const [modalValues, setModalValues] = useState<Omit<IScopeOneFleet, "id" | "createdAt" | "updatedAt"> & { date: string; unitOfDistance: string }>();
	const [openConfirmModal, setOpenConfirmModal] = useState(false);
	const [isSaving, setIsSaving] = useState(false);

	const {
		handleSubmit,
		reset,
		control,
		watch,
		formState: { errors },
	} = formMethods;

	const router = useRouter();
	const { status, data: session } = useSession();
	const { didHydrate } = useDidHydrate();

	const { queryFleetInfo, saveFleetInfo } = useAccountingDataUtils();

	const account = useMemo(() => {
		if (didHydrate && status === "authenticated") {
			return session?.user;
		}

		return null;
	}, [status, didHydrate]);

	useEffect(() => {
		async function loadFleetTypes() {
			try {
				const resp = await queryFleetInfo<string[]>({});

				if (resp?.status === "success") {
					const info = resp.data;
					if (Array.isArray(info)) {
						const options = generateOptions(info as string[]);
						setLoadedFleetTypes(options);
					}
				}
			} catch (err) {
				console.error(err);
			}
		}

		loadFleetTypes();
	}, []);

	const currentFleetType = watch("fleetType");

	useEffect(() => {
		if (!currentFleetType) return;

		async function loadFleetCategories() {
			try {
				const resp = await queryFleetInfo<{ TypeLevel1: string; TypeLevel2: string; _id: string }[]>({ TypeLevel1: currentFleetType });

				if (resp?.status === "success") {
					const info = resp.data as { TypeLevel1: string; TypeLevel2: string; _id: string }[];
					if (Array.isArray(info)) {
						// const options = generateOptions(info as string[]);
						// access the TypeLevel2 property and ensure it's unique
						const types = info.map((item) => item.TypeLevel2);
						const uniqueTypes = [...new Set(types)];

						const options = generateOptions(uniqueTypes);
						setLoadedFleetCategories(options);
					}
				}
			} catch (err) {
				console.error(err);
			}
		}

		loadFleetCategories();
	}, [currentFleetType]);

	const currentFleetCategory = watch("fleetCategory");

	useEffect(() => {
		if (!currentFleetCategory) return;

		async function loadTypeOfFuels() {
			try {
				const resp = await queryFleetInfo<
					{
						TypeLevel1: string;
						TypeLevel2: string;
						_id: string;
						fuel: string;
					}[]
				>({ TypeLevel1: currentFleetType, TypeLevel2: currentFleetCategory });

				if (resp?.status === "success") {
					const info = resp.data as { TypeLevel1: string; TypeLevel2: string; _id: string; fuel: string }[];
					if (Array.isArray(info)) {
						// access the fuel property and ensure it's unique
						const types = info.map((item) => item.fuel);
						const uniqueTypes = [...new Set(types)];
						const options = generateOptions(uniqueTypes);
						setLoadedTypeOfFuels(options);
					}
				}
			} catch (err) {
				console.error(err);
			}
		}

		loadTypeOfFuels();
	}, [currentFleetCategory]);

	const currentTypeOfFuel = watch("typeOfFuel");

	useEffect(() => {
		if (!currentTypeOfFuel) return;

		async function loadUnitOfDistance() {
			try {
				const resp = await queryFleetInfo<
					{
						TypeLevel1: string;
						TypeLevel2: string;
						fuel: string;
						unit: string;
					}[]
				>({
					TypeLevel1: currentFleetType,
					TypeLevel2: currentFleetCategory,
					fuel: currentTypeOfFuel,
				});

				if (resp?.status === "success") {
					const info = resp.data as { TypeLevel1: string; TypeLevel2: string; fuel: string; unit: string }[];
					if (Array.isArray(info)) {
						// access the unit property and ensure it's unique
						const types = info.map((item) => item.unit);
						const uniqueTypes = [...new Set(types)];
						const options = generateOptions(uniqueTypes);
						setLoadedUnitOfDistance(options);
					}
				}
			} catch (err) {
				console.error(err);
			}
		}

		loadUnitOfDistance();
	}, [currentTypeOfFuel]);

	const getTotalEmission = async ({ TypeLevel1, TypeLevel2, fuel, unit, value }) => {
		try {
			const resp = await queryFleetInfo<{ co2Value: number; _id: null }[]>({
				TypeLevel1,
				TypeLevel2,
				fuel,
				unit,
				value,
			});

			if (resp?.status === "success") {
				const info = resp.data as { co2Value: number; _id: null }[];
				const zeroArr = info?.[0];

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
		const { fleetType, fleetCategory, typeOfFuel, unitOfDistance, amountOfDistance } = data;
		const val = await getTotalEmission({ TypeLevel1: fleetType, TypeLevel2: fleetCategory, fuel: typeOfFuel, unit: unitOfDistance, value: amountOfDistance });

		setModalValues({
			date: data.date.toISOString(),
			typeLevel1: fleetType,
			typeLevel2: fleetCategory,
			fuelType: typeOfFuel,
			distanceCovered: amountOfDistance,
			c02KgEmitted: val,
			unitOfDistance: unitOfDistance,
		});

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
			const resp = await saveFleetInfo(dataToSave);

			if (resp?.status === "success") {
				toast.success("Data saved successfully", { id });
				setOpenConfirmModal(false);
				reset();
				router.push("/accounting/data-list");
			} else {
				toast.error("Failed to save data", { id });
			}
		} catch (err) {
			console.error(err);
			toast.error("Failed to save data", { id });
		} finally {
			setIsSaving(false);
		}
	};

	return (
		<AuthRedirectComponent>
			<Card className="mt-150 p-6 bg-[#E4FCE6] h-full overflow-y-scroll">
				<Head>
					<title>Fleet Emissions - SaaStain</title>
				</Head>
				<Breadcrumbs>
					<BreadcrumbItem>Accounting</BreadcrumbItem>
					<BreadcrumbItem>Add Data</BreadcrumbItem>
				</Breadcrumbs>
				<div className="p-4 mt-4">
					<h1 className="text-xl font-bold">Fleet Emissions</h1>
					<p className="mt-6">Here you can input data regarding fuel consumption from vehicles under your ownership / control. Whether it's cars, trucks or airplanes.</p>
					<Accordion>
						<AccordionItem
							key="anchor"
							aria-label="Learn More"
							indicator={({ isOpen }) => (isOpen ? <FaAnglesLeft /> : <FaAnglesRight />)}
							title={<span className="text-base text-primary-600 font-semibold">Learn More</span>}>
							<div className="space-y-4">
								<div className="flex space-x-2 items-center">
									<FaLeaf className="w-4 h-4" />
									<p className="text-xs md:text-sm font-medium">Providing specific details like vehicle models, will lead to more accurate emission calculations</p>
								</div>
								<div className="flex space-x-2 items-center">
									<FaLeaf className="w-4 h-4" />
									<p className="text-xs md:text-sm font-medium">
										If your fleet use different types of fuels, ensure separate entries for each fuel type to capture the distinct emissions characteristics
									</p>
								</div>
								<div className="flex space-x-2 items-center">
									<FaLeaf className="w-4 h-4" />
									<p className="text-xs md:text-sm font-medium">Consider integrating monitoring systems using GPS fuel cards</p>
								</div>
							</div>
						</AccordionItem>
					</Accordion>
				</div>
				<div className="p-4">
					<FormProvider {...formMethods}>
						<form onSubmit={handleSubmit(onSubmit)}>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-10">
								<div className="space-y-2">
									<p className="text-sm font-semibold">Select Accounting Period</p>
									<AppDatePicker className="w-full" name="date" control={control} />
									{errors.date && <p className="text-red-500 text-sm">{errors.date.message}</p>}
								</div>
								<AppSelect label="Fleet Type" options={loadedFleetTypes} name="fleetType" control={control} error={errors.fleetType} />
								<AppSelect label="Fleet Category" options={loadedFleetCategories} name="fleetCategory" control={control} error={errors.fleetCategory} />
								<AppSelect label="Type of fuel Used" options={loadedTypeOfFuels} name="typeOfFuel" control={control} error={errors.typeOfFuel} />
								<AppSelect label="Unit of Distance Covered" options={loadedUnitOfDistance} name="unitOfDistance" control={control} error={errors.unitOfDistance} />
								<AppInput label="Amount of Distance Covered" type="number" value={"0"} name="amountOfDistance" control={control} error={errors.amountOfDistance} placeholder="Amount of distance" />
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
				<FleetEmissionConfirmModal isOpen={openConfirmModal} setIsOpen={setOpenConfirmModal} values={modalValues} onConfirm={onConfirm} isSaving={isSaving} />
			</Card>
		</AuthRedirectComponent>
	);
};

FleetEmissions.getLayout = (page) => <AppLayout>{page}</AppLayout>;

export default FleetEmissions;
