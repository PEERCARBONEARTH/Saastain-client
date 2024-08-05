import AppInput from "@/components/forms/AppInput";
import AppMultiSelect from "@/components/forms/AppMultiSelect";
import { generateOptions } from "@/utils";
import { getLocalTimeZone, now } from "@internationalized/date";
import { Button, DatePicker, DateValue, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from "@nextui-org/react";

const adminUsers = ["Glenn", "Don", "Joyce", "Agava", "Ray"];

const ScheduleSiteVisitModal = () => {
	const { isOpen, onOpen, onOpenChange } = useDisclosure();
	return (
		<>
			<Button className="bg-green-700 text-white" onPress={onOpen}>
				Schedule Site Visit
			</Button>
			<Modal isOpen={isOpen} onOpenChange={onOpenChange}>
				<ModalContent className="saastain font-nunito">
					{(onClose) => (
						<>
							<ModalHeader className="flex flex-col gap-1">
								<h2 className="text-lg font-semibold">Schedule Site Visit</h2>
							</ModalHeader>
							<ModalBody>
								<DatePicker
									classNames={{ popoverContent: "saastain font-nunito" }}
									label="Event Date"
									variant="bordered"
									hideTimeZone
									showMonthAndYearPickers
									defaultValue={now(getLocalTimeZone()) as unknown as DateValue}
								/>
								<AppInput label={"Location"} placeholder="e.g. Jamhuri High School" />
								<AppMultiSelect label="Peercarbon Rep" options={generateOptions(adminUsers)} placeholder="Choose one or more" />
							</ModalBody>
							<ModalFooter>
								<Button size="sm" type="button" color="danger" variant="flat" onPress={onClose}>
									Close
								</Button>
								<Button size="sm" color="primary">
									Save
								</Button>
							</ModalFooter>
						</>
					)}
				</ModalContent>
			</Modal>
		</>
	);
};

export default ScheduleSiteVisitModal;
