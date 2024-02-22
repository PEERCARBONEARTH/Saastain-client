import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Spacer, useDisclosure } from "@nextui-org/react";
import AppSelect from "../forms/AppSelect";
import AppDatePicker from "../buttons/datepicker";

const typesOfReports = ["Annual", "Quarterly", "Monthly"];
const scopeLevels = ["Scope 1", "Scope 2", "Scope 3"];

const generateOptions = (options: string[]) => {
	return options.map((option) => {
		return { label: option, value: option };
	});
};

const GenerateReportModal = () => {
	const { isOpen, onOpenChange, onOpen } = useDisclosure();
	return (
		<>
			<Button color="primary" onPress={onOpen}>
				Generate New Report
			</Button>
			<Modal isOpen={isOpen} onOpenChange={onOpenChange}>
				<ModalContent>
					{(onClose) => (
						<>
							<ModalHeader style={{ fontFamily: "Nunito" }}>Generate New Report</ModalHeader>
							<ModalBody className="saastain font-nunito" style={{ fontFamily: "Nunito" }}>
								<AppSelect label="Type of Report" options={generateOptions(typesOfReports)} />
								<Spacer y={3} />
								<AppDatePicker className="w-full" />
								<Spacer y={3} />
								<AppSelect label="Select Scope Level" options={generateOptions(scopeLevels)} />
							</ModalBody>
							<ModalFooter className="saastain" style={{ fontFamily: "Nunito" }}>
								<Button color="danger" variant="bordered" onPress={onClose}>
									Cancel
								</Button>
								<Spacer x={1} />
								<Button color="primary" onPress={onClose}>
									Generate
								</Button>
							</ModalFooter>
						</>
					)}
				</ModalContent>
			</Modal>
		</>
	);
};

export default GenerateReportModal;
