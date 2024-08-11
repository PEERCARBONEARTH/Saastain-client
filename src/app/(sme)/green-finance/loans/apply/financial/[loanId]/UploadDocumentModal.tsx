import AppInput from "@/components/forms/AppInput";
import { Button, Chip, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Spacer, useDisclosure } from "@nextui-org/react";
import { useState } from "react";
import { ErrorCode, useDropzone } from "react-dropzone";
import toast from "react-hot-toast";
import { HiOutlineCloudUpload } from "react-icons/hi";

const MAX_FILE_SIZE_BYTES = 20 * 1024 * 1024;

const documentSizeValidator = (file: File) => {
	if (file.size > MAX_FILE_SIZE_BYTES) {
		return {
			code: ErrorCode.FileTooLarge,
			message: "Document or Image is larger tham 20MB",
		};
	}

	return null;
};

interface IProps {
	uploaderFn: (documentName: string, selectedFile: File) => void;
}

const UploadDocumentModal = ({ uploaderFn }: IProps) => {
	const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();
	const [documentName, setDocumentName] = useState<string>("");
	const [selectedDocument, setSelectedDocument] = useState<File | null>(null);

	const onDrop = (acceptedFiles: File[]) => {
		setSelectedDocument(acceptedFiles[0]);
	};

	const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, validator: documentSizeValidator });

	const onClickUpload = () => {
		if (!documentName) {
			toast.error("Please enter the name of the document");
			return;
		}

		if (!selectedDocument) {
			toast.error("Please select a document or a file");
			return;
		}

		uploaderFn(documentName, selectedDocument);
		onClose();
	};

	return (
		<>
			<Button type="button" onPress={onOpen} color="primary" className="w-full">
				Attach Financial Document(s)
			</Button>
			<Modal isDismissable={false} isOpen={isOpen} onOpenChange={onOpenChange}>
				<ModalContent className="saastain font-nunito">
					{(onClose) => (
						<>
							<ModalHeader>Attach Document</ModalHeader>
							<ModalBody>
								<AppInput label={"Document Name"} placeholder="e.g. Financial Model" value={documentName} setValue={setDocumentName} />
								<Spacer y={3} />
								<div className="border border-dashed border-primary flex items-center justify-center p-4 text-center rounded-xl cursor-pointer mt-2" {...getRootProps()}>
									<input {...getInputProps()} />
									{isDragActive ? (
										<p>Drop files here ...</p>
									) : (
										<div className="flex flex-col items-center gap-3">
											<HiOutlineCloudUpload className="w-8 h-8" />
											<p className="text-primary text-sm">Click to upload any document or image or drag and drop it</p>
											<em className="text-sm">(Accepting Document or Image and of less than 20MB )</em>
										</div>
									)}
								</div>
								{selectedDocument && (
									<Chip size="sm" color="primary" variant="flat">
										{selectedDocument?.name}
									</Chip>
								)}
							</ModalBody>
							<ModalFooter>
								<Button type="button" onPress={onClose} color="danger" variant="flat" size="sm">
									Cancel
								</Button>
								<Button onPress={onClickUpload} type="button" color="primary" variant="solid" size="sm">
									Upload
								</Button>
							</ModalFooter>
						</>
					)}
				</ModalContent>
			</Modal>
		</>
	);
};

export default UploadDocumentModal;
