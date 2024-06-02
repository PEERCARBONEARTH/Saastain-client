import { IScopeOneFugitiveEmission } from "@/types/Accounting";
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@nextui-org/react";
import { format } from "date-fns";
import { CheckIcon } from "lucide-react";
import { FiEdit3 } from "react-icons/fi";
import ModalSectionTitle from "../modal-sections/ModalSectionTitle";
import ModalSectionDetail from "../modal-sections/ModalSectionDetail";

interface FugitiveEmissionConfirmModalProps {
	isOpen: boolean;
	setIsOpen: (value: boolean) => void;
	values?: Omit<IScopeOneFugitiveEmission, "id" | "createdAt" | "updatedAt"> & { date: string | Date };
	onConfirm?: VoidFunction;
	isSaving?: boolean;
	actionType?: "create" | "update";
}

const FugitiveEmissionConfirmModal = ({ isOpen, setIsOpen, values, onConfirm, isSaving, actionType = "create" }: FugitiveEmissionConfirmModalProps) => {
	return (
		<Modal isOpen={isOpen} onOpenChange={setIsOpen} size="4xl" scrollBehavior="outside">
			<ModalContent className="saastain" style={{ fontFamily: "Nunito" }}>
				{(onClose) => (
					<>
						<ModalHeader>
							<h2 className="text-xl font-bold">Confirm Fugitive Emission</h2>
						</ModalHeader>
						<ModalBody>
							<div className="">
								<div className="bg-primary px-4 py-4 rounded-t-lg">
									<div className="grid grid-cols-2">
										<div className="text-white">Field</div>
										<div className="text-white">Value</div>
									</div>
								</div>
								<div className="">
									<ModalSectionTitle title="Accounting Period" />
									<ModalSectionDetail label="Date" value={values?.date ? format(new Date(values.date), "PPP") : format(new Date(), "PPP")} />
									<ModalSectionTitle title="Emission Details" />
									<ModalSectionDetail label="Fugitive Source" value={values?.emissionSource} />
									<ModalSectionDetail label="Equipment Name" value={values?.emissionName} />
									<ModalSectionTitle title="Gas" />
									<ModalSectionDetail label="Gas Emitted" value={values?.emissionGas} />
									<ModalSectionDetail label="Unit of Gas Emitted" value={values?.unit} />
									<ModalSectionDetail label="Gas Amount" value={values?.gasEmitted} />
								</div>
							</div>
						</ModalBody>
						<ModalFooter>
							<Button color="primary" variant="bordered" startContent={<FiEdit3 />} onPress={onClose}>
								{actionType === "create" ? "Edit" : "Cancel"}
							</Button>
							<Button color="primary" startContent={<CheckIcon className="w-4 h-4" />} onPress={onConfirm} isLoading={isSaving} isDisabled={isSaving}>
								{actionType === "create" ? "Confirm" : "Update"}
							</Button>
						</ModalFooter>
					</>
				)}
			</ModalContent>
		</Modal>
	);
};

export default FugitiveEmissionConfirmModal;
