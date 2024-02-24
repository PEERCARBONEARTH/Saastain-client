import { IScopeOneFuels } from "@/types/Accounting";
import { Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@nextui-org/react";
import { format } from "date-fns";
import { CheckIcon } from "lucide-react";
import { FiEdit3 } from "react-icons/fi";

interface StationaryCombustionConfirmModalProps {
	isOpen: boolean;
	setIsOpen: (value: boolean) => void;
	values?: Omit<IScopeOneFuels, "id" | "createdAt" | "updatedAt"> & { date: string | Date };
	onConfirm?: VoidFunction;
	isSaving?: boolean;
}

const StationaryCombustionConfirmModal = ({ isOpen, setIsOpen, values, onConfirm, isSaving }: StationaryCombustionConfirmModalProps) => {
	return (
		<>
			<Modal isOpen={isOpen} onOpenChange={setIsOpen} size="4xl">
				<ModalContent className="saastain" style={{ fontFamily: "Nunito" }}>
					{(onClose) => (
						<>
							<ModalHeader>
								<h2 className="text-xl font-bold">Confirm Stationary Combustion</h2>
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
										<SectionTitle title="Accounting Period" />
										<SectionDetail label="Date" value={values?.date ? format(new Date(values.date), "PPP") : format(new Date(), "PPP")} />
										<SectionTitle title="Emission" />
										<SectionDetail label="Emission Source" value={values?.emissionSource} />
										<SectionDetail label="Emission Name" value={values?.equipmentName} />
										<SectionDetail label="Total Emissions" value={values?.c02KgEmitted} />
										<SectionTitle title="Fuel" />
										<SectionDetail label="Fuel Type" value={values?.fuelType} />
										<SectionDetail label="Fuel Unit" value={values?.fuelUnit} />
										<SectionDetail label="Fuel Amount" value={values?.fuelAmount} />
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
		</>
	);
};

const SectionTitle = ({ title }: { title: string }) => {
	return (
		<div className="bg-gray-100 px-4 py-3">
			<h3 className="font-bold text-sm">{title}</h3>
		</div>
	);
};

const SectionDetail = ({ label, value }: { label: string; value: string | number }) => {
	return (
		<div className="px-4 py-5">
			<div className="grid grid-cols-2">
				<h3 className="text-gray-400 text-sm">{label}</h3>
				<h3>{value}</h3>
			</div>
		</div>
	);
};

export default StationaryCombustionConfirmModal;
