import useCompanyUtils from "@/hooks/useCompanyUtils";
import { ICompany } from "@/types/Company";
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Radio, RadioGroup, useDisclosure } from "@heroui/react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import AppBtn from "../btns/AppBtn";

interface UpdateUserCompanyModalProps {
	currentCompany: ICompany;
	userId: string;
}

const UpdateUserCompanyModal = ({ currentCompany, userId }: UpdateUserCompanyModalProps) => {
	const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

	const [companies, setCompanies] = useState<ICompany[]>([]);
	const [selectedCompany, setSelectedCompany] = useState<ICompany | null>(null);
	const [loading, setLoading] = useState<boolean>(false);

	const { getAllCompanies, adminUpdateUserWithCompany } = useCompanyUtils();

	const fetchCompanies = async () => {
		try {
			const resp = await getAllCompanies();

			if (resp?.status === "success") {
				setCompanies(resp.data);
			}
		} catch (err) {
			console.error(err);
		}
	};

	const onSubmit = async () => {
		if (!userId) return;

		if (!selectedCompany) {
			return toast.error("Please select a company");
		}

		if (currentCompany?.id) {
			if (selectedCompany.id === currentCompany?.id) {
				return toast.error("User is already in this company");
			}
		}

		setLoading(true);
		const id = toast.loading("Updating user's company...");

		try {
			const resp = await adminUpdateUserWithCompany(userId, selectedCompany.id);

			if (resp?.status === "success") {
				toast.success("User's company updated successfully", { id });
				onClose();
			} else {
				toast.error(resp?.msg ?? "Something went wrong", { id });
			}
		} catch (err) {
			console.error(err);
			toast.error(err?.message ?? "Something went wrong", { id });
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		if (isOpen) {
			fetchCompanies();
		}
	}, [isOpen]);

	return (
		<>
			<Button variant="bordered" color="primary" size="md" onClick={onOpen}>
				Update Company
			</Button>
			<Modal isOpen={isOpen} onClose={onOpenChange} scrollBehavior="inside">
				<ModalContent className="saastain font-nunito">
					{(onClose) => (
						<>
							<ModalHeader className="flex flex-col gap-1">
								<h2 className="text-lg font-semibold">Update User's Company</h2>
							</ModalHeader>
							<ModalBody>
								<RadioGroup
									label="Select Company"
									value={selectedCompany?.id}
									onChange={(e) => setSelectedCompany(companies.find((c) => c.id === e.target.value))}
									classNames={{
										label: "text-sm font-medium text-gray-800",
									}}>
									{companies.map((company) => (
										<Radio
											key={company.id}
											value={company.id}
											description={company?.location}
											classNames={{
												label: "text-[12px] font-medium text-gray-800",
											}}>
											{company.companyName}
										</Radio>
									))}
								</RadioGroup>
								<p className="text-sm text-gray-500 mt-2">Select a company to move this user to</p>
							</ModalBody>
							<ModalFooter>
								<Button size="sm" type="button" color="danger" variant="flat" onPress={onClose}>
									Close
								</Button>
								<AppBtn text="Update" isLoading={loading} onPress={onSubmit} loadingText="Updating ..." isDisabled={loading} />
							</ModalFooter>
						</>
					)}
				</ModalContent>
			</Modal>
		</>
	);
};

export default UpdateUserCompanyModal;
