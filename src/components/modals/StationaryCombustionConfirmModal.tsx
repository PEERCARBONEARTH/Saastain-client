import { IScopeOneFuels } from "@/types/Accounting";
import { Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@nextui-org/react";
import { format } from "date-fns";
import { CheckIcon } from "lucide-react";
import { FiEdit3 } from "react-icons/fi";
import ModalSectionTitle from "../modal-sections/ModalSectionTitle";
import ModalSectionDetail from "../modal-sections/ModalSectionDetail";

interface StationaryCombustionConfirmModalProps {
	isOpen: boolean;
	setIsOpen: (value: boolean) => void;
	values?: Omit<IScopeOneFuels, "id" | "createdAt" | "updatedAt"> & { date: string | Date };
	onConfirm?: VoidFunction;
	isSaving?: boolean;
	actionType?: "create" | "update";
	customTitle?: string;
}

const StationaryCombustionConfirmModal = ({ isOpen, setIsOpen, values, onConfirm, isSaving, actionType = "create", customTitle }: StationaryCombustionConfirmModalProps) => {
	return (
		<>
			<Modal isOpen={isOpen} onOpenChange={setIsOpen} size="4xl" scrollBehavior="outside">
				<ModalContent className="saastain" style={{ fontFamily: "Nunito" }}>
					{(onClose) => (
						<>
							<ModalHeader>
								<h2 className="text-xl font-bold">
									Confirm {customTitle ? customTitle : "Stationary Combustion"} {customTitle && "Emissions"}
								</h2>
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
										<ModalSectionDetail label="Emission Name" value={values?.equipmentName} />
										<ModalSectionDetail label="Total Emissions" value={values?.c02KgEmitted} />
										<ModalSectionTitle title="Fuel" />
										<ModalSectionDetail label="Fuel Type" value={values?.fuelType} />
										<ModalSectionDetail label="Fuel Unit" value={values?.fuelUnit} />
										<ModalSectionDetail label="Fuel Amount" value={values?.fuelAmount} />
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
		</>
	);
};

export default StationaryCombustionConfirmModal;
