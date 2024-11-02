import AppInput from "@/components/forms/AppInput";
import AppNextSelect from "@/components/forms/AppNextSelect";
import AppSelect from "@/components/forms/AppSelect";
import { fugitiveAddEquipmentDataInfo, processingAddEquipmentDataInfo } from "@/data/configuration";
import useEquipmentMobilityUtils from "@/hooks/useEquipmentsMobilityUtils";
import { swrFetcher } from "@/lib/api-client";
import { IApiEndpoint } from "@/types/Api";
import { IBranch } from "@/types/Company";
import { ProcessingEquipmentAccess, ProcessingEquipmentCategory } from "@/types/EquipmentMobility";
import { ProcessingFugitiveKeyType } from "@/types/ProcessingAndFugitive";
import { generateOptions } from "@/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Divider, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Switch, Tooltip, useDisclosure } from "@nextui-org/react";
import { useSession } from "next-auth/react";
import { useMemo, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { HiInformationCircle, HiPlus } from "react-icons/hi";
import useSWR from "swr";
import { z } from "zod";

interface IProps {
	variant: ProcessingEquipmentCategory;
	category: ProcessingFugitiveKeyType;
	mutate?: VoidFunction;
}

const formSchema = z.object({
	equipmentName: z.string().min(1, "Name of equipment is required"),
	gasEmitted: z.string().min(1, "Please select the gas emitted by the equipment"),
	emissionGasUnit: z.string().min(1, "Please select the gas unit of the gas emitted"),
	branch: z.string(),
});

const gasesEmitted = ["Carbon", "Methane", "Sulphide OX"];
const units = ["Tonnes", "Litres", "Giga Tonnes"];

const ProcessingFugitiveEquipmentModal = ({ variant, category, mutate }: IProps) => {
	const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();
	const [loading, setLoading] = useState<boolean>(false);
	const [isGlobalEquipment, setIsGlobalEquipment] = useState<boolean>(false);

	const { data: session } = useSession();

	const id = session?.user?.company?.id;

	const { data: branchInfo } = useSWR<IBranch[]>(!id ? null : [IApiEndpoint.GET_COMPANY_BRANCHES, { id }], swrFetcher, {
		keepPreviousData: true,
	});

	const { saveNewProcessingEquipment } = useEquipmentMobilityUtils();

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

	const formMethods = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			equipmentName: "",
			gasEmitted: "",
			emissionGasUnit: "",
			branch: "",
		},
	});

	const {
		control,
		handleSubmit,
		formState: { errors: formErrors },
		reset,
	} = formMethods;

	const onSubmit = handleSubmit(async (data) => {
		const dataInfo = data as Required<z.infer<typeof formSchema>>;

		const { branch, ...rest } = dataInfo;

		let info = {
			...rest,
			category: variant,
			subCategory: category,
			accessibility: isGlobalEquipment ? ProcessingEquipmentAccess.GLOBAL : ProcessingEquipmentAccess.BRANCH_SPECIFIC,
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
			const resp = await saveNewProcessingEquipment(info);

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
								{variant === ProcessingEquipmentCategory.FUGITIVE && (
									<ModalHeader className="flex flex-col gap-2">
										<Tooltip content={fugitiveAddEquipmentDataInfo[category].tooltipText}>
											<Button variant="light" isIconOnly>
												<HiInformationCircle className="w-6 h-6 text-gray-400" />
											</Button>
										</Tooltip>
										<h1 className="font-semibold text-2xl">New Equipment: {fugitiveAddEquipmentDataInfo[category].title}</h1>
										<p className="text-sm text-gray-600 font-normal">{fugitiveAddEquipmentDataInfo[category].description}</p>
									</ModalHeader>
								)}
								{variant === ProcessingEquipmentCategory.PROCESSING && (
									<ModalHeader className="flex flex-col gap-2">
										<Tooltip content={processingAddEquipmentDataInfo[category].tooltipText}>
											<Button variant="light" isIconOnly>
												<HiInformationCircle className="w-6 h-6 text-gray-400" />
											</Button>
										</Tooltip>
										<h1 className="font-semibold text-2xl">New Equipment: {processingAddEquipmentDataInfo[category].title}</h1>
										<p className="text-sm text-gray-600 font-normal">{processingAddEquipmentDataInfo[category].description}</p>
									</ModalHeader>
								)}
								<ModalBody>
									<AppInput label={"Name"} placeholder="Equipment Name" name="equipmentName" control={control} error={formErrors.equipmentName} />
									<AppSelect
										label="Gas Emitted"
										placeholder="Choose ..."
										name="gasEmitted"
										control={control}
										error={formErrors.gasEmitted}
										options={generateOptions(gasesEmitted)}
										helperText="Refers to the type of gas emitted"
									/>
									<AppSelect
										label="Units"
										placeholder="Choose ..."
										name="emissionGasUnit"
										control={control}
										error={formErrors.emissionGasUnit}
										options={generateOptions(units)}
										helperText="Refers to the units you use to measure the amount of gas emitted"
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

export default ProcessingFugitiveEquipmentModal;
