import { IScopeOneProcessEmission } from "@/types/Accounting";
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@nextui-org/react";
import ModalSectionTitle from "../modal-sections/ModalSectionTitle";
import ModalSectionDetail from "../modal-sections/ModalSectionDetail";
import { format } from "date-fns";
import { FiEdit3 } from "react-icons/fi";
import { CheckIcon } from "lucide-react";

interface ProcessEmissionConfirmModalProps {
	isOpen: boolean;
	setIsOpen: (value: boolean) => void;
	values?: Omit<IScopeOneProcessEmission, "id" | "createdAt" | "updatedAt"> & { date: string | Date };
	onConfirm?: VoidFunction;
	isSaving?: boolean;
	actionType?: "create" | "update";
}

const ProcessEmissionConfirmModal = ({ isOpen, setIsOpen, values, onConfirm, isSaving, actionType = "create" }: ProcessEmissionConfirmModalProps) => {
	return (
		<Modal isOpen={isOpen} onOpenChange={setIsOpen} size="4xl" scrollBehavior="outside">
			<ModalContent className="saastain" style={{ fontFamily: "Nunito" }}>
				{(onClose) => (
					<>
						<ModalHeader>
							<h2 className="text-xl font-bold">Confirm Fleet Emission</h2>
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
									<ModalSectionTitle title="Emission" />
									<ModalSectionDetail label="Emission Source" value={values?.emissionSource} />
									<ModalSectionDetail label="Equipment Name" value={values?.emissionName} />
									<ModalSectionTitle title="Gas Emitted" />
									<ModalSectionDetail label="Waste Gas" value={values?.wasteGas} />
									<ModalSectionDetail label="Unit" value={values?.unit} />
									<ModalSectionDetail label="Gas Amount" value={values?.gasAmount} />
								</div>
							</div>
						</ModalBody>
						<ModalFooter>
							<Button color="primary" variant="bordered" startContent={<FiEdit3 />} onPress={onClose}>
								{actionType === "create" ? "Edit" : "Cancel"}
							</Button>
							<Button color="primary" startContent={<CheckIcon className="w-4 h-4" />} onPress={onConfirm} isLoading={isSaving} isDisabled={isSaving}>
								{actionType === "update" ? "Update" : "Confirm"}
							</Button>
						</ModalFooter>
					</>
				)}
			</ModalContent>
		</Modal>
	);
};

export default ProcessEmissionConfirmModal;
