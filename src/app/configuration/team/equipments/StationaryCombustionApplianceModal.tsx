import AppInput from "@/components/forms/AppInput";
import AppNextSelect from "@/components/forms/AppNextSelect";
import AppSelect from "@/components/forms/AppSelect";
import { stationaryCombustionAddEquipmentData } from "@/data/configuration";
import useAccountingDataUtils from "@/hooks/useAccountingDataUtils";
import useEquipmentMobilityUtils from "@/hooks/useEquipmentsMobilityUtils";
import { swrFetcher } from "@/lib/api-client";
import { IScopeOneQueryFuelResponse1 } from "@/types/Accounting";
import { IApiEndpoint } from "@/types/Api";
import { StationaryCombustionAddVariant } from "@/types/Appliances";
import { IBranch } from "@/types/Company";
import { EquipmentAccess } from "@/types/EquipmentMobility";
import { IOption } from "@/types/Forms";
import { generateOptions } from "@/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Divider, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Switch, Tooltip, useDisclosure } from "@nextui-org/react";
import { useSession } from "next-auth/react";
import { useEffect, useMemo, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { HiInformationCircle, HiPlus } from "react-icons/hi";
import useSWR from "swr";
import { z } from "zod";

interface IProps {
	variant: StationaryCombustionAddVariant;
	mutate?: VoidFunction;
}

const fuelStates = ["Gaseous fuels", "Solid fuels", "Liquid fuels"];

const schema = z.object({
	equipmentName: z.string().min(1, "Name of equipment is required"),
	fuelState: z.string().min(1, "Fuel State is required"),
	fuelType: z.string().min(1, "Fuel Type is required"),
	fuelUnit: z.string().min(1, "Fuel Unit is required"),
	branch: z.string(),
});

const StationaryCombustionApplianceModal = ({ variant, mutate }: IProps) => {
	const { isOpen, onOpenChange, onOpen, onClose } = useDisclosure();
	const [isGlobalEquipment, setIsGlobalEquipment] = useState<boolean>(false);
	const [loading, setLoading] = useState<boolean>(false);

	const { data: session } = useSession();

	const id = session?.user?.company?.id;

	const { data: branchInfo } = useSWR<IBranch[]>(!id ? null : [IApiEndpoint.GET_COMPANY_BRANCHES, { id }], swrFetcher, {
		keepPreviousData: true,
	});

	const [dbFuelTypes, setDbFuelTypes] = useState<IOption[]>([]);
	const [queryOne1Fuel, setQueryOne1Fuel] = useState<IScopeOneQueryFuelResponse1[]>([]);
	const [units, setUnits] = useState<any>();

	const formMethods = useForm<z.infer<typeof schema>>({
		resolver: zodResolver(schema),
		defaultValues: {
			equipmentName: "",
			fuelState: "",
			fuelType: "",
			fuelUnit: "",
			branch: "",
		},
	});

	const {
		setValue,
		watch,
		control,
		handleSubmit,
		formState: { errors: formErrors },
		resetField,
		getValues,
		reset,
	} = formMethods;

	const { queryFuelsInfo } = useAccountingDataUtils();
	const { saveNewStationaryEquipment } = useEquipmentMobilityUtils();

	const currentFuelState = watch("fuelState");

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

	const generatedBranchOptions = useMemo(() => {
		if (branchInfo && branchInfo?.length) {
			return branchInfo.map((item) => {
				return {
					label: item.name,
					value: item.id,
				};
			});
		}

		return [];
	}, [branchInfo]);

	const onSubmit = handleSubmit(async (data) => {
		const { branch, ...rest } = data;

		let info = {
			...rest,
			category: variant,
			accessibility: isGlobalEquipment ? EquipmentAccess.GLOBAL : EquipmentAccess.BRANCH_SPECIFIC,
			userId: session?.user?.id,
			companyId: id,
			branchId: null,
		};

		if (!isGlobalEquipment) {
			if (!branch) {
				toast.error("Please select equipment branch");
				return;
			}

			info = {
				...info,
				branchId: branch,
			};
		} else {
			delete info.branchId;
		}

		setLoading(true);

		try {
			const resp = await saveNewStationaryEquipment(info as any);

			if (resp?.status === "success") {
				toast.success("Equipment Saved Successfully");
				reset();
				setIsGlobalEquipment(false);
				mutate && mutate?.();
				onClose();
			} else {
				toast.error("Unable to save the equipment at the moment");
			}
		} catch (err) {
			toast.error("Unable to save the equipment at the moment");
		} finally {
			setLoading(false);
		}
	});

	return (
		<>
			<Button color="primary" endContent={<HiPlus />} onPress={onOpen}>
				Add
			</Button>
			<Modal isOpen={isOpen} onOpenChange={onOpenChange}>
				<ModalContent className="saastain font-nunito">
					{(onClose) => (
						<FormProvider {...formMethods}>
							<form onSubmit={onSubmit}>
								<ModalHeader className="flex flex-col gap-2">
									<Tooltip content={stationaryCombustionAddEquipmentData[variant].tooltipText}>
										<Button variant="light" isIconOnly>
											<HiInformationCircle className="w-6 h-6 text-gray-400" />
										</Button>
									</Tooltip>
									<h1 className="font-semibold text-2xl">New Equipment: {stationaryCombustionAddEquipmentData[variant].title}</h1>
									<p className="text-sm text-gray-600 font-normal">{stationaryCombustionAddEquipmentData[variant].description}</p>
								</ModalHeader>
								<ModalBody>
									<AppInput label={"Name"} placeholder="Equipment Name" name="equipmentName" control={control} error={formErrors.equipmentName} />
									<AppSelect
										label="Fuel State"
										helperText="In what state of fuel does the equipment consume."
										options={generateOptions(fuelStates)}
										placeholder="Choose Fuel State ..."
										name="fuelState"
										control={control}
										error={formErrors.fuelState}
									/>
									<AppSelect
										label="Type of Fuel"
										helperText="What type of fuel does the equipment consume."
										options={dbFuelTypes}
										placeholder="Choose Fuel Type ..."
										name="fuelType"
										control={control}
										error={formErrors.fuelType}
										onSelectAction={onSelectedFuelType}
									/>
									<AppSelect
										label="Unit of Fuel"
										helperText="Choose the unit of measurement of fuel consumption"
										options={generateOptions([units])}
										placeholder="Choose Unit ..."
										name="fuelUnit"
										control={control}
										error={formErrors.fuelUnit}
									/>
									<div>
										<Switch color="primary" isSelected={isGlobalEquipment} onValueChange={setIsGlobalEquipment}>
											<span className="text-sm">{isGlobalEquipment ? "" : "Not"} Accessible to All Branches</span>
										</Switch>
										<p className="text-xs text-gray-400">Choose to whether make the equipment accessible to all branches</p>
									</div>
									{!isGlobalEquipment && <AppNextSelect label="Branch" options={generatedBranchOptions} placeholder="Choose Branch ..." name="branch" control={control} error={formErrors.branch} />}
									<Divider />
								</ModalBody>
								<ModalFooter>
									<Button onPress={onClose} type="button" variant="bordered" color="primary">
										Cancel
									</Button>
									<Button color="primary" type="submit" isLoading={loading} isDisabled={loading}>
										Save
									</Button>
								</ModalFooter>
							</form>
						</FormProvider>
					)}
				</ModalContent>
			</Modal>
		</>
	);
};

export default StationaryCombustionApplianceModal;
