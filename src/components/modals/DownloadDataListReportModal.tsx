import React, { useState } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Select, SelectItem } from "@heroui/react";

interface DownloadDataListReportModalProps {
	isOpen: boolean;
	onClose: () => void;
	onDownload: (period: string, scope: string, formart:string) => void;
	companyName: string;
}

const periods = [
	{ value: "one-month", label: "Last 1 Month" },
	{ value: "two-months", label: "Last 2 Month" },
	{ value: "three-months", label: "Last 3 Months" },
	{ value: "six-months", label: "Last 6 Months" },
	{ value: "one-year", label: "Last 1 Year" },
];

const scopes = [
	{ value: "all", label: "All" },
	{ value: "scope-one", label: "Scope 1" },
	{ value: "scope-two", label: "Scope 2" },
];


const formats = [
	{ value: "csv", label: "CSV" },
	{ value: "excel", label: "Excel" },
	{ value: "pdf", label: "PDF" },
];

const DownloadDataListReportModal: React.FC<DownloadDataListReportModalProps> = ({ isOpen, onClose, onDownload, companyName }) => {
	const [selectedPeriod, setSelectedPeriod] = useState("one-month");
	const [selectedScope, setSelectedScope] = useState("scope-one");
	const [selectedFormat, setSelectedFormat] = useState("csv");

	const handleDownload = () => {
		onDownload(selectedPeriod, selectedScope, selectedFormat);
		// onOpenChange(false);
	  };
	  
	return (
		<Modal isOpen={isOpen} onClose={onClose}>
			<ModalContent className="saastain font-nunito" >
				<ModalHeader>Download Data List for {companyName}</ModalHeader>
				<ModalBody>
					<p>Please select the period, scope & format for the data list report:</p>
					<Select label="Select Period" value={selectedPeriod} onChange={(e) => setSelectedPeriod(e.target.value)}>
						{periods.map((period) => (
							<SelectItem key={period.value} value={period.value}>
								{period.label}
							</SelectItem>
						))}
					</Select>
					<Select label="Select Scope" value={selectedScope} onChange={(e) => setSelectedScope(e.target.value)}>
						{scopes.map((scope) => (
							<SelectItem key={scope.value} value={scope.value}>
								{scope.label}
							</SelectItem>
						))}
					</Select>
					<Select label="Select Format" value={selectedFormat} onChange={(e) => setSelectedFormat(e.target.value)}>
						{formats.map((format) => (
							<SelectItem key={format.value} value={format.value}>
								{format.label}
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
							handleDownload;
							onClose();
						}}>
						Download
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};

export default DownloadDataListReportModal;
