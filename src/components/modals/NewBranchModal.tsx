import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Spacer, useDisclosure } from "@nextui-org/react";
import { MdAdd } from "react-icons/md";
import AppInput from "../forms/AppInput";
import AppSelect from "../forms/AppSelect";
import { generateOptions } from "@/utils";
import AppRadioGroup from "../forms/AppRadioGroup";

const branchLevels = ["Subsidiary", "Franchise", "Satellite"];
const isMainBranch = ["Yes", "No"];

const NewBranchModal = () => {
	const { isOpen, onOpen, onOpenChange } = useDisclosure();
	return (
		<>
			<Button startContent={<MdAdd />} color="primary" onPress={onOpen}>
				Add Location
			</Button>
			<Modal isOpen={isOpen} onOpenChange={onOpenChange} scrollBehavior="outside">
				<ModalContent className="saastain" style={{ fontFamily: "Nunito" }}>
					{(onClose) => (
						<>
							<ModalHeader>New Branch</ModalHeader>
							<ModalBody>
								<AppInput label="Branch Name" placeholder="Enter branch name" />
								<Spacer y={1} />
								<AppSelect label="Branch Level" options={generateOptions(branchLevels)} />
								<Spacer y={1} />
								<AppInput label="Street Address" placeholder="Enter street address" />
								<Spacer y={1} />
								<AppRadioGroup label="Is this the main branch?" options={generateOptions(isMainBranch)} orientation="horizontal" />
							</ModalBody>
							<ModalFooter>
								<Button color="danger" variant="bordered" onPress={onClose}>
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

export default NewBranchModal;
