import AppCombobox from "@/components/forms/AppCombobox";
import AppInput from "@/components/forms/AppInput";
import useEquipmentMobilityUtils from "@/hooks/useEquipmentMobilityUtils";
import { swrFetcher } from "@/lib/api-client";
import { IApiEndpoint } from "@/types/Api";
import { capitalize, generateOptions } from "@/utils";
import { Button, Divider, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { HiPlus } from "react-icons/hi";
import useSWR from "swr";
import { z } from "zod";

const formSchema = z.object({
	make: z.string().min(1, "Please select a vehicle make"),
	model: z.string().min(1, "Please enter a vehicle model"),
});

interface IProps {
	mutate?: VoidFunction;
}

const NewModelForMakeModal = ({ mutate }: IProps) => {
	const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();
	const [isSaving, setIsSaving] = useState<boolean>(false);

	const formMethods = useForm<z.infer<typeof formSchema>>({ resolver: zodResolver(formSchema), defaultValues: { make: "", model: "" } });

	const { data: vehiclesMakesData } = useSWR<{ makes: string[] }>([IApiEndpoint.MOBILITY_QUERY_MAKES], swrFetcher, { keepPreviousData: true });

	const { addNewModelToMake } = useEquipmentMobilityUtils();

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
        reset
	} = formMethods;

	const onSubmit = handleSubmit(async (data) => {
		const info = {
			make: data.make,
			model: capitalize(data.model),
		};

		const id = toast.loading("Saving");
		setIsSaving(true);

		try {
			const resp = await addNewModelToMake(info);

			if (resp?.status === "success") {
				toast.success("Model Updated Successfully", { id });
                reset()
				mutate && mutate?.();
				onClose();
			} else {
				toast.error("Unable to update the model", { id });
			}
		} catch (err) {
			toast.error("Unable to update the model", { id });
		} finally {
			setIsSaving(false);
		}
	});

	return (
		<>
			<Button color="primary" startContent={<HiPlus />} onPress={onOpen}>
				Add New Model For Make
			</Button>
			<Modal isOpen={isOpen} onOpenChange={onOpenChange}>
				<ModalContent className="saastain font-nunito">
					{(onClose) => (
						<FormProvider {...formMethods}>
							<form onSubmit={onSubmit}>
								<ModalHeader>
									<h1 className="font-semibold text-2xl">Add New Model For Make</h1>
								</ModalHeader>
								<ModalBody>
									<AppCombobox label="Vehicle Make" options={fetchedVehicleMakes} placeholder="Choose Make ..." name="make" control={control} error={formErrors.make} />
									<AppInput label={"Vehicle Model"} placeholder="Enter model name" name="model" control={control} error={formErrors.model} />
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

export default NewModelForMakeModal;
