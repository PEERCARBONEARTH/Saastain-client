import AppInput from "@/components/forms/AppInput";
import FileInput from "@/components/forms/FileInput";
import useDocumentsUtils from "@/hooks/useDocumentsUtils";
import useGreenLoanUtils from "@/hooks/useGreenLoanUtils";
import { dataURItoBlob } from "@/lib/upload";
import { AppEnumRoutes } from "@/types/AppEnumRoutes";
import { IGreenLoanApplication, SLAType } from "@/types/GreenLoanApplication";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from "@heroui/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

const formSchema = z.object({
	documentName: z.string().min(1, "Please add Document Name"),
	documentUrl: z.string().min(1, "Attach a document"),
});

interface IProps {
	loanDetails: IGreenLoanApplication;
}

const GenerateSLADocumentTokenForVendorAndSME = ({ loanDetails }: IProps) => {
	const { isOpen, onOpen, onOpenChange } = useDisclosure();
	const [loading, setLoading] = useState<boolean>(false);

	const formMethod = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			documentName: `SLA Document for ${loanDetails.order?.vendor?.companyName} and ${loanDetails?.company?.companyName}`,
			documentUrl: "",
		},
	});

	const { uploadOneDocument } = useDocumentsUtils();
	const { requestDocusealDocument } = useGreenLoanUtils();

	const { data: session } = useSession();
	const router = useRouter();

	const account = useMemo(() => {
		if (session?.user) return session?.user;

		return null;
	}, [session]);

	const {
		handleSubmit,
		formState: { errors: formErrors },
		reset,
		control,
	} = formMethod;

	const onSubmit = async (data: z.infer<typeof formSchema>) => {
		const id = toast.loading("Generating Document ...");

		setLoading(true);

		const info = {
			type: SLAType.VENDOR_SME,
			documentName: data.documentName,
			loanId: loanDetails.id,
			initialEmailAccess: account?.email,
		};

		const documentBlob = dataURItoBlob(data.documentUrl);

		try {
			const respUrl = await uploadOneDocument({ folder: `sla/documents/${loanDetails?.company.id}`, file: documentBlob });

			if (respUrl?.status === "success") {
				let newInfo = {
					...info,
					documentUrl: respUrl?.data,
				};

				const respToken = await requestDocusealDocument(newInfo);

				if (respToken?.status === "success") {
					toast.success("Document Generated Successfully", { id });
					// we need to redirect
					router.push(`/${AppEnumRoutes.APP_SLA_DOCUMENTS_EDIT}/${respToken.data}`);
					reset();
				} else {
					toast("Unable to generate document at this time", { id });
				}
			} else {
				toast("Unable to generate document at this time.", { id });
			}
		} catch (err) {
			toast("Unable to generate document at this time..", { id });
		} finally {
			setLoading(false);
		}
	};

	return (
		<>
			<Button color="primary" size="sm" onPress={onOpen}>
				Add
			</Button>
			<Modal isOpen={isOpen} onOpenChange={onOpenChange}>
				<ModalContent className="saastain font-nunito" >
					{(onClose) => (
						<FormProvider {...formMethod}>
							<form onSubmit={handleSubmit(onSubmit)}>
								<ModalHeader>Generate SLA Document for Vendor and SME</ModalHeader>
								<ModalBody>
									<AppInput label={"Document Name"} placeholder="SLA Document" name="documentName" control={control} error={formErrors.documentName} />
									<FileInput labelText="Attach SLA Document" name="documentUrl" control={control} error={formErrors.documentUrl} accept="application/pdf, image/*" />
								</ModalBody>
								<ModalFooter>
									<Button size="sm" type="button" color="danger" variant="flat" onPress={onClose}>
										Close
									</Button>
									<Button size="sm" color="primary" type="submit" isLoading={loading} isDisabled={loading}>
										Generate
									</Button>
								</ModalFooter>
							</form>
						</FormProvider>
					)}
				</ModalContent>
			</Modal>
		</>
	);
};

export default GenerateSLADocumentTokenForVendorAndSME;
