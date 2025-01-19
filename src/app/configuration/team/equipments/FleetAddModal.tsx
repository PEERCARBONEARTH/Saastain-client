import AppCombobox from "@/components/forms/AppCombobox";
import AppSelect from "@/components/forms/AppSelect";
import { fleetsDataInfo } from "@/data/configuration";
import useEquipmentMobilityUtils from "@/hooks/useEquipmentsMobilityUtils";
import { swrFetcher } from "@/lib/api-client";
import { IApiEndpoint } from "@/types/Api";
import { IBranch } from "@/types/Company";
import { FleetMobilityAccess } from "@/types/EquipmentMobility";
import { FleetAddVariant } from "@/types/Fleet";
import { IOption } from "@/types/Forms";
import { generateOptions } from "@/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Divider, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Switch, Tooltip, useDisclosure } from "@heroui/react";
import { useSession } from "next-auth/react";
import { useEffect, useMemo, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { HiInformationCircle, HiPlus } from "react-icons/hi";
import useSWR from "swr";
import { z } from "zod";

interface IProps {
	variant: FleetAddVariant;
	mutate?: VoidFunction;
}

const formSchema = z.object({
	make: z.string().min(1, "Please select a vehicle make"),
	model: z.string().min(1, "Please select a vehicle model"),
	branch: z.string(),
});

const FleetAddModal = ({ variant, mutate }: IProps) => {
	const { isOpen, onOpenChange, onOpen, onClose } = useDisclosure();
	const [_models, setModels] = useState<string[]>([]);
	const [modelOptions, setModelOptions] = useState<IOption[]>([]);
	const [isGlobalFleetItem, setIsGlobalFleetItem] = useState<boolean>(false);
	const [isSaving, setIsSaving] = useState<boolean>(false);

	const { data: session } = useSession();

	const id = session?.user?.company?.id;

	const { data: vehiclesMakesData } = useSWR<{ makes: string[] }>([IApiEndpoint.MOBILITY_QUERY_MAKES], swrFetcher, { keepPreviousData: true });

	const { data: branchInfo } = useSWR<IBranch[]>(!id ? null : [IApiEndpoint.GET_COMPANY_BRANCHES, { id }], swrFetcher, {
		keepPreviousData: true,
	});

	const fetchedVehicleMakes = useMemo(() => {
		if (vehiclesMakesData && vehiclesMakesData?.makes?.length) {
			return generateOptions(vehiclesMakesData.makes);
		}
		return [];
	}, [vehiclesMakesData]);

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

	const formMethods = useForm<z.infer<typeof formSchema>>({ resolver: zodResolver(formSchema), defaultValues: { make: "", model: "", branch: "" } });

	const {
		control,
		handleSubmit,
		formState: { errors: formErrors },
		resetField,
		reset,
		setValue,
		watch,
	} = formMethods;

	const selectedMake = watch("make");

	const { getVehicleModelsByMake, saveFleetMobilityItem } = useEquipmentMobilityUtils();

	useEffect(() => {
		async function loadMakeModels() {
			if (!selectedMake) return;

			try {
				const rawResp = await getVehicleModelsByMake(selectedMake);

				if (rawResp.status === "success") {
					setModels(rawResp.data.models);
					resetField("model");
					setModelOptions(generateOptions(rawResp.data.models));
					setValue("model", rawResp?.data?.models?.[0]);
				}
			} catch (err) {
				console.log("err", err);
			}
		}

		loadMakeModels();
	}, [selectedMake]);

	const onSubmit = handleSubmit(async (data) => {
		let info = {
			make: data.make,
			model: data.model,
			category: variant,
			accessibility: isGlobalFleetItem ? FleetMobilityAccess.GLOBAL : FleetMobilityAccess.BRANCH_SPECIFIC,
			userId: session?.user?.id,
			companyId: id,
			branchId: null,
		};

		if (!isGlobalFleetItem) {
			if (!data.branch) {
				toast.error("Please select vehicle branch");
				return;
			}

			info = {
				...info,
				branchId: data.branch,
			};
		} else {
			delete info.branchId;
		}

		setIsSaving(true);

		try {
			const resp = await saveFleetMobilityItem(info);

			if (resp?.status === "success") {
				toast.success("Vehicle Saved Successfully");
				reset();
				setIsGlobalFleetItem(false);
				mutate && mutate?.();
				onClose();
			} else {
				toast.error("Unable to save the vehicle at the moment");
			}
		} catch (err) {
			toast.error("Unable to save the vehicle at the moment");
		} finally {
			setIsSaving(false);
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
									<Tooltip content={fleetsDataInfo[variant].tooltipText}>
										<Button variant="light" isIconOnly>
											<HiInformationCircle className="w-6 h-6 text-gray-400" />
										</Button>
									</Tooltip>
									<h1 className="font-semibold text-2xl">New Vehicle: {fleetsDataInfo[variant].title}</h1>
									<p className="text-sm text-gray-600 font-normal">{fleetsDataInfo[variant].description}</p>
								</ModalHeader>
								<ModalBody>
									<AppCombobox label="Vehicle Make" options={fetchedVehicleMakes} placeholder="Choose Make ..." name="make" control={control} error={formErrors.make} />
									<AppCombobox label="Vehicle Model" options={modelOptions} placeholder="Choose Model ..." name="model" control={control} error={formErrors.model} />
									<div>
										<Switch color="primary" isSelected={isGlobalFleetItem} onValueChange={setIsGlobalFleetItem}>
											<span className="text-sm">{isGlobalFleetItem ? "" : "Not"} Accessible to All Branches</span>
										</Switch>
										<p className="text-xs text-gray-400">Choose to whether make the vehicle accessible to all branches</p>
									</div>
									{!isGlobalFleetItem && <AppSelect label="Branch" options={generatedBranchOptions} placeholder="Choose Branch ..." name="branch" control={control} error={formErrors.branch} />}
									<Divider />
								</ModalBody>
								<ModalFooter>
									<Button onPress={onClose} type="button" variant="bordered" color="primary">
										Cancel
									</Button>
									<Button color="primary" type="submit" isLoading={isSaving} isDisabled={isSaving}>
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

export default FleetAddModal;
