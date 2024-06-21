import { Button, Modal, ModalBody, ModalContent, ModalHeader, useDisclosure } from "@nextui-org/react";
import { FaCloudUploadAlt } from "react-icons/fa";
import { HiOutlineCloudUpload } from "react-icons/hi";
import { BsFileEarmarkBarGraphFill } from "react-icons/bs";
import { XIcon } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { useCallback } from "react";

const UploadExcelSheetModal = () => {
	const { isOpen, onOpen, onOpenChange } = useDisclosure();

	const onDrop = useCallback(<T extends File>(acceptedFiles: T[]) => {
		acceptedFiles.forEach((file) => {

			const reader = new FileReader();

			reader.onabort = () => console.log("file reading was aborted");
			reader.onerror = () => console.log("file reading has failed");
			reader.onload = () => {
				// Do whatever you want with the file contents
				const binaryStr = reader.result;
				console.log(binaryStr);
			};
			reader.readAsArrayBuffer(file);
		});
	}, []);

	const { getRootProps, getInputProps } = useDropzone({
		maxFiles: 1,
		accept: {
			"text/csv": [],
			"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [],
			"application/vnd.ms-excel": [],
		},
		onDrop,
	});
	return (
		<>
			<Button color="primary" endContent={<FaCloudUploadAlt />} onPress={onOpen}>
				Upload File
			</Button>
			<Modal isOpen={isOpen} onOpenChange={onOpenChange}>
				<ModalContent className="saastain font-nunito">
					{(onClose) => (
						<>
							<ModalHeader>
								<div className=" border-b-2 border-gray-900 w-full">
									<h1>Upload File</h1>
								</div>
							</ModalHeader>
							<ModalBody>
								<p className="text-sm">
									Download Template <span className="text-primary underline">here</span>
								</p>
								<div className="my-3">
									<div {...getRootProps({ className: "bg-[#D1D5DB] py-12 rounded-2xl" })}>
										<input {...getInputProps()} />
										<div className="flex flex-col items-center justify-center space-y-4">
											<HiOutlineCloudUpload className="w-16 h-16" />
											<p className="font-normal">Click select to upload or Drop your files</p>
											<p className="font-normal text-sm">.csv,.xls or .xlxs types are supported </p>
										</div>
									</div>
								</div>
								<div className="px-3">
									<div className="flex items-center justify-between py-2 border-b">
										<div className="flex items-center space-x-4">
											<BsFileEarmarkBarGraphFill className="w-5 h-5" />
											<p className="text-sm">DocName.csv</p>
											<p className="text-sm">443KB</p>
										</div>
										<Button size="sm" variant="light" color="danger" isIconOnly>
											<XIcon />
										</Button>
									</div>
									<div className="flex items-center justify-between py-2 border-b">
										<div className="flex items-center space-x-4">
											<BsFileEarmarkBarGraphFill className="w-5 h-5" />
											<p className="text-sm">DocName.csv</p>
											<p className="text-sm">443KB</p>
										</div>
										<Button size="sm" variant="light" color="danger" isIconOnly>
											<XIcon />
										</Button>
									</div>
								</div>
							</ModalBody>
						</>
					)}
				</ModalContent>
			</Modal>
		</>
	);
};

export default UploadExcelSheetModal;
