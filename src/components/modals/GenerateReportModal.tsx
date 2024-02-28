import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Spacer, useDisclosure } from "@nextui-org/react";
import AppSelect from "../forms/AppSelect";
import AppDatePicker from "../buttons/datepicker";
import { generateOptions } from "@/utils";

const typesOfReports = ["Annual", "Quarterly", "Monthly"];
const scopeLevels = ["Scope 1", "Scope 2", "Scope 3"];

const GenerateReportModal = () => {
	const { isOpen, onOpenChange, onOpen } = useDisclosure();
	return (
		<>
			<Button color="primary" onPress={onOpen}>
				Generate New Report
			</Button>
			<Modal isOpen={isOpen} onOpenChange={onOpenChange} scrollBehavior="outside">
				<ModalContent className="saastain" style={{ fontFamily: "Nunito" }}>
					{(onClose) => (
						<>
							<ModalHeader>Generate New Report</ModalHeader>
							<ModalBody>
								<AppSelect label="Type of Report" options={generateOptions(typesOfReports)} />
								<Spacer y={1} />
								<AppDatePicker className="w-full" />
								<Spacer y={1} />
								<AppSelect label="Select Scope Level" options={generateOptions(scopeLevels)} />
							</ModalBody>
							<ModalFooter>
								<Button color="danger" variant="bordered" onPress={onClose}>
									Cancel
								</Button>
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
