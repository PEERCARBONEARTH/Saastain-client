import AppCombobox from "@/components/forms/AppCombobox";
import AppInput from "@/components/forms/AppInput";
import useEquipmentMobilityUtils from "@/hooks/useEquipmentMobilityUtils";
import { swrFetcher } from "@/lib/api-client";
import { IApiEndpoint } from "@/types/Api";
import { IOption } from "@/types/Forms";
import { generateOptions } from "@/utils";
import { Button, Divider, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { FC, useEffect, useMemo, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { HiPlus } from "react-icons/hi";
import useSWR from "swr";
import { z } from "zod";

const formSchema = z.object({
	make: z.string().min(1, "Please select a vehicle make"),
	model: z.string().min(1, "Please select a vehicle model"),
	emission_factor: z.coerce.number().positive("Value must be greater than 0"),
});

interface IProps {
	mutate?: VoidFunction;
}

const NewVehicleEmissionFactorData: FC<IProps> = ({ mutate }) => {
	const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();
	const [_models, setModels] = useState<string[]>([]);
	const [modelOptions, setModelOptions] = useState<IOption[]>([]);
	const [isSaving, setIsSaving] = useState<boolean>(false);

	const formMethods = useForm<z.infer<typeof formSchema>>({ resolver: zodResolver(formSchema), defaultValues: { make: "", model: "" } });

	const { data: vehiclesMakesData } = useSWR<{ makes: string[] }>([IApiEndpoint.MOBILITY_QUERY_MAKES], swrFetcher, { keepPreviousData: true });

	const { getVehicleModelsByMake, createNewVehicleEmissionData } = useEquipmentMobilityUtils();

	const fetchedVehicleMakes = useMemo(() => {
		if (vehiclesMakesData && vehiclesMakesData?.makes?.length) {
			return generateOptions(vehiclesMakesData.makes);
		}
		return [];
	}, [vehiclesMakesData]);

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
		const info = {
			make: data.make,
			model: data.model,
			co2e_gm: Number(data.emission_factor),
			co2e_kg: Number(data.emission_factor) / 1000,
		};

		const id = toast.loading("Saving ...");
		setIsSaving(true);

		try {
			const resp = await createNewVehicleEmissionData(info);

			if (resp?.status === "success") {
				toast.success("Emission Factor Added Successfully", { id });
				reset();
				mutate && mutate?.();
				onClose();
			} else {
				toast.error(resp?.msg ?? "Unable to add the emission factor at the moment", { id });
			}
		} catch (err) {
			toast.error("Unable to add the emission factor at the moment");
		} finally {
			setIsSaving(false);
		}
	});

	return (
		<>
			<Button color="primary" startContent={<HiPlus />} onPress={onOpen}>
				Add Emission Factor
			</Button>
			<Modal isOpen={isOpen} onOpenChange={onOpenChange}>
				<ModalContent className="saastain font-nunito">
					{(onClose) => (
						<FormProvider {...formMethods}>
							<form onSubmit={onSubmit}>
								<ModalHeader>
									<h1 className="font-semibold text-2xl">New Vehicle Emission Factor</h1>
								</ModalHeader>
								<ModalBody>
									<AppCombobox label="Vehicle Make" options={fetchedVehicleMakes} placeholder="Choose Make ..." name="make" control={control} error={formErrors.make} />
									<AppCombobox label="Vehicle Model" options={modelOptions} placeholder="Choose Model ..." name="model" control={control} error={formErrors.model} />
									<AppInput label={"Emission Factor Value (In g/Km)"} placeholder="e.g. 83" name="emission_factor" control={control} error={formErrors.emission_factor} />
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

export default NewVehicleEmissionFactorData;
