import { IScopeOneFleetEmissionsMakeModel } from "@/types/Accounting";
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@nextui-org/react";
import ModalSectionTitle from "../modal-sections/ModalSectionTitle";
import ModalSectionDetail from "../modal-sections/ModalSectionDetail";
import { format } from "date-fns";
import { FiEdit3 } from "react-icons/fi";
import { CheckIcon } from "lucide-react";

interface FleetEmissionConfirmModalProps {
	isOpen: boolean;
	setIsOpen: (value: boolean) => void;
	values?: Omit<IScopeOneFleetEmissionsMakeModel, "id" | "createdAt" | "updatedAt"> & { date: string | Date };
	onConfirm?: VoidFunction;
	isSaving?: boolean;
	actionType?: "create" | "update";
}

const FleetMakeModelEmissionConfirmModal = ({ isOpen, setIsOpen, values, onConfirm, isSaving, actionType }: FleetEmissionConfirmModalProps) => {
	return (
		<Modal isOpen={isOpen} onOpenChange={setIsOpen} size="4xl" scrollBehavior="outside">
			<ModalContent className="saastain" style={{ fontFamily: "Nunito" }}>
				{(onClose) => (
					<>
						<ModalHeader>
							<h2 className="text-xl font-bold">Confirm Fleet Emissions Data</h2>
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
									<ModalSectionTitle title="Fleet" />
									<ModalSectionDetail label="Make" value={values?.vehicleMake} />
									<ModalSectionDetail label="Model" value={values?.vehicleModel} />
									<ModalSectionTitle title="Distance Covered" />
									<ModalSectionDetail label="Amount of Distance Covered" value={values?.distanceCovered} />
									<ModalSectionTitle title="Emission" />
									<ModalSectionDetail label="Total Emissions" value={values?.c02KgEmitted} />
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

export default FleetMakeModelEmissionConfirmModal;
