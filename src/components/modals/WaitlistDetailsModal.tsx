import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Chip, Spacer } from "@heroui/react";
import AppBtn from "../btns/AppBtn";
import { ChevronRight } from "lucide-react";
import { HiFlag } from "react-icons/hi";
import { IWaitlist, WailistStatus } from "@/types/Waitlist";

const mapStatusToColor: Record<string, string> = {
	[WailistStatus.PENDING]: "warning",
	[WailistStatus.APPROVED]: "success",
	[WailistStatus.CANCELLED]: "danger",
	[WailistStatus.IN_PROGRESS]: "primary",
};

interface WaitlistModalDetailsProps {
	waitlist: IWaitlist;
}

export default function WaitlistModalDetails({ waitlist }: WaitlistModalDetailsProps) {
	const { isOpen, onOpen, onOpenChange } = useDisclosure();

	return (
		<>
			<AppBtn text="View" endContent={<ChevronRight className="w-4 h-5" />} onPress={onOpen} />
			<Modal isOpen={isOpen} onOpenChange={onOpenChange}>
				<ModalContent className="saastain font-nunito">
					{(onClose) => (
						<>
							<ModalHeader className="flex flex-col gap-1">
								<h2 className="text-lg font-semibold">Waitlist Details</h2>
							</ModalHeader>
							<ModalBody>
								<Chip className="capitalize" color={mapStatusToColor[waitlist.status] as any}>{waitlist.status}</Chip>
								<div className="flex items-center space-x-2">
									<h3 className="text-lg font-semibold">Company Name:</h3>
									<p className="text-sm">{waitlist.companyName}</p>
								</div>
								<div className="flex items-center space-x-2">
									<h3 className="text-lg font-semibold">Email:</h3>
									<p className="text-sm">
										<a className="underline text-primary-600" href={`mailto:${waitlist.email}`}>
											{waitlist.email}
										</a>
									</p>
								</div>
								<div className="flex items-center space-x-2">
									<h3 className="text-lg font-semibold">Contact Person:</h3>
									<p className="text-sm">{waitlist?.name}</p>
								</div>
								<div className="flex items-center space-x-2">
									<h3 className="text-lg font-semibold">Phone No:</h3>
									<p className="text-sm">
										<a className="underline text-primary-600" href={`tel:${waitlist.phoneNo}`}>
											{waitlist.phoneNo}
										</a>
									</p>
								</div>
								<Spacer y={2} />
								<p className="text-sm text-gray-500">Set Up a follow up call to understand their needs better</p>
								<Spacer y={2} />
								<AppBtn text="Follow Up" endContent={<ChevronRight className="w-4 h-4" />} onPress={() => {}} />
								<Spacer y={2} />
								<Button variant="bordered" endContent={<HiFlag className="w-4 h-4" />}>
									Flag Company
								</Button>
							</ModalBody>
							<ModalFooter>
								<Button color="danger" variant="light" onPress={onClose}>
									Close
								</Button>
							</ModalFooter>
						</>
					)}
				</ModalContent>
			</Modal>
		</>
	);
}
