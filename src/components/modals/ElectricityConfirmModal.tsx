import { IScopeTwoElectricity } from "@/types/Accounting";
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@nextui-org/react";
import ModalSectionTitle from "../modal-sections/ModalSectionTitle";
import ModalSectionDetail from "../modal-sections/ModalSectionDetail";
import { FiEdit3 } from "react-icons/fi";
import { CheckIcon } from "lucide-react";
import { format } from "date-fns";

interface ElectricityConfirmModalProps {
	isOpen: boolean;
	setIsOpen: (value: boolean) => void;
	values?: Omit<IScopeTwoElectricity, "id" | "createdAt" | "updatedAt"> & { date: string | Date; country: string; isRenewable: string };
	onConfirm?: VoidFunction;
	isSaving?: boolean;
}

const ElectricityConfirmModal = ({ isOpen, setIsOpen, values, onConfirm, isSaving }: ElectricityConfirmModalProps) => {
	return (
		<Modal isOpen={isOpen} onOpenChange={setIsOpen} size="4xl" scrollBehavior="inside">
			<ModalContent className="saastain" style={{ fontFamily: "Nunito" }}>
				{(onClose) => (
					<>
						<ModalHeader>
							<h2 className="text-xl font-bold">Confirm Heat & Steam</h2>
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
									<ModalSectionTitle title="Other Details" />
									<ModalSectionDetail label="Country" value={values?.country} />
                                    <ModalSectionDetail label="Is Renewable" value={values?.isRenewable} />
                                    <ModalSectionDetail label="Emission Released" value={values?.amount} />
                                    <ModalSectionDetail label="Emission Unit" value={values?.units} />
                                    <ModalSectionDetail label="Total Emissions" value={values?.totalEmissions} />
								</div>
							</div>
						</ModalBody>
						<ModalFooter>
							<Button color="primary" variant="bordered" startContent={<FiEdit3 />} onPress={onClose}>
								Edit
							</Button>
							<Button color="primary" startContent={<CheckIcon className="w-4 h-4" />} onPress={onConfirm} isLoading={isSaving} isDisabled={isSaving}>
								Confirm
							</Button>
						</ModalFooter>
					</>
				)}
			</ModalContent>
		</Modal>
	);
};

export default ElectricityConfirmModal;
