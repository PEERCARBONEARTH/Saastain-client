import { advanceVehiclesExcelColumnsData, createAdvanceVehicleUploadExcelSheet } from "@/lib/excel";
import { getFileSize } from "@/lib/utils";
import { Button, Link, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from "@heroui/react";
import { Loader, XIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import toast from "react-hot-toast";
import { BsFileEarmarkBarGraphFill } from "react-icons/bs";
import { FaCloudUploadAlt } from "react-icons/fa";
import { HiOutlineCloudUpload } from "react-icons/hi";
import ExcelJS from "exceljs";
import AppTable, { IAppTableColumn } from "../table/AppTable";
import useAccountingDataUtils from "@/hooks/useAccountingDataUtils";
import { format } from "date-fns";
import { AppKey } from "@/types/Global";
import { nanoid } from "nanoid";
import { IScopeOneFleetEmissionsMakeModel } from "@/types/Accounting";

type IVariant = "delivery-vehicles" | "passenger-vehicles";

interface IProps {
	variant: IVariant;
}

type TConsolidatedData = {
	date: string;
	make: string;
	model: string;
	distance: number;
	vehicleNoPlate: string;
	emissions: number;
	id: string;
	metadata: object;
};

type TPreConsolidatedData = Omit<TConsolidatedData, "emissions" | "id" | "metadata">;

const previewColumns: IAppTableColumn[] = [
	{
		name: "Date",
		uid: "date",
	},
	{
		name: "Make",
		uid: "make",
	},
	{
		name: "Model",
		uid: "model",
	},
	{
		name: "Distance",
		uid: "distance",
	},
	{
		name: "Vehicle No. Plate",
		uid: "vehicleNoPlate",
	},
	{
		name: "Emissions (KgC02e)",
		uid: "emissions",
	},
];

const UploadAdvanceVehicleEmissionsExcelSheetModal = ({ variant }: IProps) => {
	const disclosureId01 = nanoid();
	const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure({ id: disclosureId01 });

	const { data: session } = useSession();
	const [uploadedFiles, setUploadedFiles] = useState<ArrayBuffer[]>([]);
	const [files, setFiles] = useState<File[]>([]);
	const [loadedData, setLoadedData] = useState<TPreConsolidatedData[]>([]);
	const [consolidatedData, setConsolidatedData] = useState<TConsolidatedData[]>([]);
	const [isSaving, setIsSaving] = useState<boolean>(false);
	const [dialogOpen, setDialogOpen] = useState<boolean>(false);
	const [isComputingEmissions, setIsComputingEmissions] = useState<boolean>(false);

	const { queryFleetEmissionsByMakeAndModelBulk, bulkSaveFleetEmissionsDataByMakeAndModel } = useAccountingDataUtils();

	const onDrop = useCallback(<T extends File>(acceptedFiles: T[]) => {
		const file = acceptedFiles[0];
		const reader = new FileReader();
		var arrayBuffer: ArrayBuffer;
		reader.onloadend = async (e) => {
			setUploadedFiles([e.target?.result as ArrayBuffer]);
			arrayBuffer = e.target?.result as ArrayBuffer;
		};
		reader.readAsArrayBuffer(file);
		setFiles([file]);
		// validate the excel sheet after 100ms to prevent file [undefined] error
		setTimeout(() => {
			// using arrayBuffer to validate the excel sheet as useState is in queue and not updated immediately
			validateExcelSheet(arrayBuffer).then(async (isValid) => {
				if (!isValid) {
					toast.error("Invalid Excel Sheet", { duration: 5000 });
					setFiles([]);
					setUploadedFiles([]);
					return;
				}

				toast.success("Excel Sheet is valid", { duration: 5000 });

				await loadData(arrayBuffer);
			});
		}, 100);
	}, []);

	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		maxFiles: 1,
		accept: {
			"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [],
			"application/vnd.ms-excel": [],
		},
		onDrop,
	});

	const onClickDownloadTemplate = async () => {
		const id = toast.loading("Downloading Template...");
		try {
			await createAdvanceVehicleUploadExcelSheet(session?.user?.company?.companyName, variant);

			toast.success("Template downloaded successfully", { id });
		} catch (err) {
			toast.error("Failed to download template", { id });
		}
	};

	const removeFile = (index: number) => {
		const newFiles = files.filter((_, i) => i !== index);
		setFiles(newFiles);
	};

	const validateExcelSheet = async (file: ArrayBuffer) => {
		const workbook = new ExcelJS.Workbook();
		await workbook.xlsx.load(file);
		const worksheet = workbook.getWorksheet(1);

		const variantColumns = advanceVehiclesExcelColumnsData[variant];
		const requiredColumnNames = variantColumns.map((col) => col.header.toLowerCase());
		const uploadedColumnHeaders = (worksheet.getRow(1).values as string[]).filter((item) => item).map((header) => header.toLowerCase());

		// Check if all required columns are present in the uploaded file
		return requiredColumnNames.every((requiredCol) => uploadedColumnHeaders.includes(requiredCol));
	};

	const getEmissionsBulk = async (data: { vehicleMake: string; vehicleModel: string; distanceCovered: string }[]) => {
		try {
			const resp = await queryFleetEmissionsByMakeAndModelBulk(data);

			if (resp?.status === "success") {
				const rawData = resp?.data;
				const formattedResp = rawData.map((item) => ({ emissions: item.co2e_kg, metadata: item }));

				console.log("rawData", rawData);
				console.log("formattedResp", formattedResp);

				return formattedResp;
			}

			return [];
		} catch (err) {
			console.error("err:getEmissionsBulk", err);
			return [];
		}
	};

	const loadData = async (file: ArrayBuffer) => {
		const id = toast.loading("Loading Data...");
		const workbook = new ExcelJS.Workbook();
		await workbook.xlsx.load(file);
		const worksheet = workbook.getWorksheet(1);

		const data = [];
		worksheet.eachRow((row, rowNumber) => {
			if (rowNumber === 1) return;
			data.push((row.values as any[]).filter((item) => item));
		});

		// data is an array of arrays, now convert it to an array of objects
		const formattedData = data.map((item) => {
			const [date, make, model, distance, vehicleNoPlate] = item;
			return {
				date: new Date(date).toISOString(),
				make,
				model,
				distance,
				vehicleNoPlate,
			};
		});

		toast.success("Data loaded successfully", { id });
		setLoadedData(formattedData);

		if (formattedData.length > 0) {
			const dataToSend = formattedData.map((item) => ({
				vehicleMake: item.make,
				vehicleModel: item.model,
				distanceCovered: parseFloat(item.distance).toString(),
			}));

			toast.loading("Computing Emissions...", { id: "emissions" });
			setIsComputingEmissions(true);

			const emissionsData = await getEmissionsBulk(dataToSend);

			if (emissionsData.length > 0) {
				toast.success("Data Emissions loaded successfully", { duration: 5000, id: "emissions" });

				const dataWithEmissions = formattedData.map((item, idx) => {
                    if (!emissionsData[idx]?.emissions) {
                        console.log("emissionsData[idx].emissions;", emissionsData?.[idx]?.emissions);
                        console.log("idx", idx);
                    }
					const c02KgEmitted = emissionsData?.[idx]?.emissions ?? 0
					const metadata = emissionsData?.[idx]?.metadata ?? 0


					const id = `${nanoid()}-${idx}`;

					return { id, ...item, c02KgEmitted, metadata };
				});

				const consolidatedData = dataWithEmissions.map((item) => ({
					date: item.date,
					make: item.make,
					model: item.model,
					distance: parseFloat(item.distance),
					vehicleNoPlate: item.vehicleNoPlate,
					emissions: item.c02KgEmitted,
					id: item.id,
					metadata: item.metadata,
				})) as TConsolidatedData[];

				setConsolidatedData(consolidatedData);

				onClose();

				setDialogOpen(true);
			} else {
				toast.error("Failed to load data", { duration: 5000, id: "emissions" });
				setIsComputingEmissions(false);
			}
		} else {
			toast.error("Failed to load data", { duration: 5000, id });
		}
	};

	const renderCell = useCallback((item: TConsolidatedData, columnKey: AppKey) => {
		switch (columnKey) {
			case "date":
				return format(new Date(item.date), "MMM, yyyy");
			case "make":
				return item.make;
			case "model":
				return item.model;
			case "distance":
				return item.distance;
			case "vehicleNoPlate":
				return item.vehicleNoPlate;
			case "emissions":
				return Number(item.emissions).toFixed(2) ?? 0;
			default:
				return "";
		}
	}, []);

	const onClickSubmit = async () => {
		const id = toast.loading("Saving Data...");

		const dataToBeSaved = consolidatedData.map((item) => ({
			vehicleMake: item.make,
			vehicleModel: item.model,
			date: item.date,
			distanceCovered: parseFloat(String(item.distance)).toString(),
			c02KgEmitted: item.emissions,
			resultsMetadata: item.metadata as IScopeOneFleetEmissionsMakeModel["resultsMetadata"],
		}));

		const info = {
			companyId: session.user?.company?.id,
			dataItems: dataToBeSaved,
			userId: session?.user?.id,
			subCategory: variant,
		};

		setIsSaving(true);

		try {
			const resp = await bulkSaveFleetEmissionsDataByMakeAndModel(info);

			if (resp.status === "success") {
				toast.success("Data saved successfully", { duration: 5000, id });
				setDialogOpen(false);
			} else {
				toast.error("Failed to save data", { duration: 5000, id });
			}
		} catch (err) {
			console.error(err);
			toast.error("Failed to save data", { duration: 5000, id });
		} finally {
			setIsSaving(true);
		}
	};
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
								<div className="text-sm">
									Download Template
									<Link
										href="#"
										className="text-primary ml-1"
										onPress={() => {
											onClickDownloadTemplate();
										}}>
										here
									</Link>
								</div>
								<div className="my-3">
									<div {...getRootProps({ className: "bg-[#D1D5DB] py-12 rounded-2xl" })}>
										<input {...getInputProps()} />
										{isDragActive ? (
											<p className="text-lg font-semibold text-center">Drop the files here ...</p>
										) : (
											<div className="flex flex-col items-center justify-center space-y-4">
												<HiOutlineCloudUpload className="w-16 h-16" />
												<p className="font-normal">Click select to upload or Drop your files</p>
												<p className="font-normal text-sm">.xls or .xlxs types are supported </p>
											</div>
										)}
									</div>
								</div>
								<div className="px-3">
									{files.length > 0 &&
										files.map((file, index) => (
											<div key={index} className="flex items-center justify-between gap-1.5 py-2 border-b">
												<div className="flex items-center space-x-4">
													<BsFileEarmarkBarGraphFill className="w-5 h-5" />
													<p className="text-sm">{file.name}</p>
													<p className="text-xs">{getFileSize(file.size)}</p>
												</div>
												<Button size="sm" variant="light" color="danger" onPress={() => removeFile(index)} isIconOnly>
													<XIcon className="w-5 h-5" />
												</Button>
											</div>
										))}
									{files.length === 0 && (
										<div className="flex items-center justify-center py-2">
											<p className="text-sm">No files uploaded</p>
										</div>
									)}
								</div>
								{isComputingEmissions && (
									<div className="flex items-center gap-2">
										<Loader className="animate-spin text-primary-500" />
										<p className="text-primary-500 text-sm">Computing Emissions ...</p>
									</div>
								)}
							</ModalBody>
							<ModalFooter>
								<Button color="danger" onPress={onClose}>
									Cancel
								</Button>
							</ModalFooter>
						</>
					)}
				</ModalContent>
			</Modal>
			<Modal isOpen={dialogOpen} onOpenChange={setDialogOpen} size="5xl" isDismissable={false} scrollBehavior="inside">
				<ModalContent className="saastain font-nunito">
					{(onClose) => (
						<>
							<ModalHeader>
								<div className=" border-b-2 border-gray-900 w-full">
									<h1>Preview Data</h1>
								</div>
							</ModalHeader>
							<ModalBody>
								<AppTable<TConsolidatedData>
									title={"Preview Data"}
									data={consolidatedData}
									headerColumns={previewColumns}
									renderCell={renderCell}
									emptyContent="No data found"
									count={consolidatedData.length}
									isLoading={false}
									showBottomContent={false}
									hideSearch={true}
								/>
							</ModalBody>
							<ModalFooter>
								<Button color="danger" onPress={onClose}>
									Cancel
								</Button>
								<Button color="primary" onPress={onClickSubmit} isDisabled={isSaving} isLoading={isSaving}>
									Submit
								</Button>
							</ModalFooter>
						</>
					)}
				</ModalContent>
			</Modal>
		</>
	);
};

export default UploadAdvanceVehicleEmissionsExcelSheetModal;
