import AppCombobox from "@/components/forms/AppCombobox";
import AppSelect from "@/components/forms/AppSelect";
import { fleetsDataInfo } from "@/data/configuration";
import useEquipmentMobilityUtils from "@/hooks/useEquipmentsMobilityUtils";
import { swrFetcher } from "@/lib/api-client";
import { IApiEndpoint } from "@/types/Api";
import { IBranch } from "@/types/Company";
import { FleetAddVariant } from "@/types/Fleet";
import { IOption } from "@/types/Forms";
import { generateOptions } from "@/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Divider, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Tooltip, useDisclosure } from "@nextui-org/react";
import { useSession } from "next-auth/react";
import { useEffect, useMemo, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
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
	const { isOpen, onOpenChange, onOpen } = useDisclosure();
	const [_models, setModels] = useState<string[]>([]);
	const [modelOptions, setModelOptions] = useState<IOption[]>([]);

	const { data: session } = useSession();

	const id = session?.user?.company?.id;

	const { data: vehiclesMakesData } = useSWR<{ makes: string[] }>(!isOpen ? null : [IApiEndpoint.MOBILITY_QUERY_MAKES], swrFetcher, { keepPreviousData: true });

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
		getValues,
		reset,
		setValue,
		watch,
	} = formMethods;

	const selectedMake = watch("make");

	const { getVehicleModelsByMake } = useEquipmentMobilityUtils();

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

	const onSubmit = handleSubmit(async (data) => {});

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
									<Tooltip content={"Sed ut perspiciatis unde omnis iste natus error sit"}>
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
									<AppSelect label="Branch" options={generatedBranchOptions} placeholder="Choose Branch ..." />
									<Divider />
								</ModalBody>
								<ModalFooter>
									<Button onPress={onClose} type="button" variant="bordered" color="primary">
										Cancel
									</Button>
									<Button color="primary" type="submit">
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
