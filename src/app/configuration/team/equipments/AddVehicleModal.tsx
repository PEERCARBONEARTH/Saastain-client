import AppSelect from "@/components/forms/AppSelect";
import { generateOptions } from "@/utils";
import { Button, Divider, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Tooltip, useDisclosure } from "@heroui/react";
import { HiInformationCircle, HiPlus } from "react-icons/hi";

const vehicleMakes = ["Toyota", "Ford", "Honda", "Chevrolet", "Nissan"];
const vehicleModels = ["Camry", "F-150", "Civic", "Malibu", "Altima", "Corolla", "Explorer", "Accord", "Silverado", "Rogue"];
const branchOpts = ["All", "Branch 1", "Branch 2", "Branch 3"];

const AddVehicleModal = () => {
	const { isOpen, onOpenChange, onOpen } = useDisclosure();

	return (
		<>
			<Button color="primary" endContent={<HiPlus />} onPress={onOpen}>
				Add
			</Button>
			<Modal isOpen={isOpen} onOpenChange={onOpenChange}>
				<ModalContent className="saastain font-nunito">
					{(onClose) => (
						<>
							<ModalHeader className="flex flex-col gap-2">
								<Tooltip content={"Sed ut perspiciatis unde omnis iste natus error sit"}>
									<Button variant="light" isIconOnly>
										<HiInformationCircle className="w-6 h-6 text-gray-400" />
									</Button>
								</Tooltip>
								<h1 className="font-semibold text-2xl">New Vehicle</h1>
								<p className="text-sm text-gray-600 font-normal">
									Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis
								</p>
							</ModalHeader>
							<ModalBody>
								<AppSelect label="Vehicle Make" options={generateOptions(vehicleMakes)} placeholder="Choose Make ..." />
								<AppSelect label="Vehicle Model" options={generateOptions(vehicleModels)} placeholder="Choose Model ..." />
								<AppSelect label="Branch" options={generateOptions(branchOpts)} placeholder="Choose Branch ..." />
								<Divider />
							</ModalBody>
							<ModalFooter>
								<Button onPress={onClose} type="button" variant="bordered" color="primary">
									Cancel
								</Button>
								<Button color="primary" onPress={onClose}>
									Save
								</Button>
							</ModalFooter>
						</>
					)}
				</ModalContent>
			</Modal>
		</>
	);
};

export default AddVehicleModal;
