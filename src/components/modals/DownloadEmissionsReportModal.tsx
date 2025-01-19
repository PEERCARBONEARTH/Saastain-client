import React, { useState } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Select, SelectItem } from "@heroui/react";

interface DownloadEmissionsModalProps {
	isOpen: boolean;
	onClose: () => void;
	onDownload: (period: string) => void;
	companyName: string;
}

const periods = [
	{ value: "one-month", label: "Last 1 Month" },
	{ value: "two-months", label: "Last 2 Month" },
	{ value: "three-months", label: "Last 3 Months" },
	{ value: "six-months", label: "Last 6 Months" },
	{ value: "one-year", label: "Last 1 Year" },
];

const DownloadEmissionsModal: React.FC<DownloadEmissionsModalProps> = ({ isOpen, onClose, onDownload, companyName }) => {
	const [selectedPeriod, setSelectedPeriod] = useState("one-month");

	return (
		<Modal isOpen={isOpen} onClose={onClose}>
			<ModalContent className="saastain font-nunito" >
				<ModalHeader>Download Emissions Report for {companyName}</ModalHeader>
				<ModalBody>
					<p>Please select the period for the emissions report:</p>
					<Select label="Select Period" value={selectedPeriod} onChange={(e) => setSelectedPeriod(e.target.value)}>
						{periods.map((period) => (
							<SelectItem key={period.value} value={period.value}>
								{period.label}
							</SelectItem>
						))}
					</Select>
				</ModalBody>
				<ModalFooter>
					<Button color="danger" variant="light" onPress={onClose}>
						Cancel
					</Button>
					<Button
						color="primary"
						onPress={() => {
							onDownload(selectedPeriod);
							onClose();
						}}>
						Download
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};

export default DownloadEmissionsModal;
