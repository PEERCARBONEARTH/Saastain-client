import AppInput from "@/components/forms/AppInput";
import AppSelect from "@/components/forms/AppSelect";
import { generateOptions } from "@/utils";
import { Button, Divider, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Tooltip, useDisclosure } from "@nextui-org/react";
import { HiInformationCircle, HiPlus } from "react-icons/hi";

const scopeOpts = ["All", "Scope 1", "Scope 2"];
const branchOpts = ["All", "Branch 1", "Branch 2", "Branch 3"];

const AddApplianceModal = () => {
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
								<h1 className="font-semibold text-2xl">New Appliance</h1>
								<p className="text-sm text-gray-600 font-normal">
									Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis
								</p>
							</ModalHeader>
							<ModalBody>
								<AppInput label={"Name"} placeholder="Appliance Name" />
								<AppSelect label="Scope" options={generateOptions(scopeOpts)} placeholder="Choose Scope ..." />
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

export default AddApplianceModal;
