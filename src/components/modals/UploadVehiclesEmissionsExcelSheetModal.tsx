import { Button, Link, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from "@nextui-org/react";
import { FaCloudUploadAlt } from "react-icons/fa";
import { HiOutlineCloudUpload } from "react-icons/hi";
import { BsFileEarmarkBarGraphFill } from "react-icons/bs";
import { XIcon } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { useCallback, useState } from "react";
import { createVehicleUploadExcelSheet } from "@/lib/excel";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { getFileSize } from "@/lib/utils";
import ExcelJS from "exceljs";
import useAccountingDataUtils from "@/hooks/useAccountingDataUtils";
import { nanoid } from "nanoid";
import { AppKey } from "@/types/Global";
import { format } from "date-fns";
import AppTable, { IAppTableColumn } from "../table/AppTable";

type IVariant = "delivery-vehicles" | "passenger-vehicles";

const TypeLevel2OptionsMap = {
	["small"]: "Vans",
	["medium"]: "HGV (all diesel)",
	["large"]: "HGVs refrigerated(all diesel)",
};

const mapVariantToFleetType = {
    ["delivery-vehicles"]: "Delivery vehicles",
    ["passenger-vehicles"]: "Passenger vehicles",
}

type TRespTypeEmissionsVal = { co2Value: number; _id: null };

type TRespTypeEmissions = Record<string, TRespTypeEmissionsVal[]>;

type TConsolidatedData = {
	date: string;
	category: string;
	fuelType: string;
	distance: number;
	vehicleNoPlate: string;
	emissions: number;
	id: string;
};

type TPreConsolidatedData = Omit<TConsolidatedData, "emissions" | "id">;

const previewColumns: IAppTableColumn[] = [
	{
		name: "Date",
		uid: "date",
	},
	{
		name: "Category",
		uid: "category",
	},
	{
		name: "Fuel Type",
		uid: "fuelType",
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


interface IProps {
	variant: IVariant;
}

const UploadVehiclesEmissionsExcelSheetModal = ({ variant }: IProps) => {
	const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
	const previewDisclosure = useDisclosure();

	const { data: session } = useSession();
	const [uploadedFiles, setUploadedFiles] = useState<ArrayBuffer[]>([]);
	const [files, setFiles] = useState<File[]>([]);
	const [loadedData, setLoadedData] = useState<TPreConsolidatedData[]>([]);
	const [emissionsData, setEmissionsData] = useState<TRespTypeEmissions>({});
	const [consolidatedData, setConsolidatedData] = useState<TConsolidatedData[]>([]);
	const [isSaving, setIsSaving] = useState<boolean>(false);

	const { queryFleetInfoBulk, saveBulkFleetInfo } = useAccountingDataUtils();

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
			await createVehicleUploadExcelSheet(session?.user?.company?.companyName, variant);

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

		const columnNames = ["Accounting Period", "Fleet Category", "Fuel Type", "Distance Covered (KM)", "Vehicle No. Plate"];
		const columnHeaders = (worksheet.getRow(1).values as string[]).filter((item) => item);

		if (columnHeaders.length !== columnNames.length) {
			return false;
		}

		for (let i = 0; i < columnNames.length; i++) {
			if (columnHeaders[i].toLowerCase() !== columnNames[i].toLowerCase()) {
				return false;
			}
		}

		return true;
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
			const [date, category, fuelType, distance, vehicleNoPlate] = item;
			return {
				date: new Date(date).toISOString(),
				category,
				fuelType,
				distance,
				vehicleNoPlate,
			};
		});

		toast.success("Data loaded successfully", { id });
		setLoadedData(formattedData);

		// we need to send to backend to compute the emissions
		if (formattedData.length > 0) {
			const dataToSend = formattedData.map((item) => ({
				TypeLevel1: mapVariantToFleetType[variant] ?? "Delivery vehicles",
				TypeLevel2: variant === "delivery-vehicles" ? TypeLevel2OptionsMap[item.category] ?? "Vans" : item.category ?? "small car" ,
				fuel: item.fuelType ?? "Diesel",
				value: Number(item.distance) ?? 0,
				unit: "km",
			}));

			toast.loading("Computing Emissions...", { id: "emissions" });

			// call backend
			try {
				const response = await queryFleetInfoBulk<TRespTypeEmissions>(dataToSend);

				if (response.status === "success") {
					toast.success("Data loaded successfully", { duration: 5000, id: "emissions" });
					setEmissionsData(response.data[0]);

					const consolidatedData = formattedData.map((item, index) => {
						const emissions = response.data[0][`vehicles_${index}`].length > 0 ? response.data[0][`vehicles_${index}`][0].co2Value : 0;
						return {
							...item,
							emissions,
							id: `${nanoid()}-${index}`,
						} as TConsolidatedData;
					});

					setConsolidatedData(consolidatedData);

					onClose();

					// open preview modal
					previewDisclosure.onOpen();
				} else {
					toast.error("Failed to load data", { duration: 5000, id: "emissions" });
				}
			} catch (err) {
				console.error(err);
				toast.error("Failed to load data", { duration: 5000, id: "emissions" });
			}
		}
	};

	const renderCell = useCallback((item: TConsolidatedData, columnKey: AppKey) => {
		switch (columnKey) {
			case "date":
				return format(new Date(item.date), "MMM, yyyy");
			case "category":
				return item.category;
			case "fuelType":
				return item.fuelType;
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

		const dataToSend = consolidatedData.map((item) => ({
			date: new Date(item.date),
			typeLevel1: mapVariantToFleetType[variant] ?? "Delivery vehicles",
			typeLevel2: variant === "delivery-vehicles" ? TypeLevel2OptionsMap[item.category] ?? "Vans" : item.category ?? "small car",
			fuelType: item.fuelType ?? "Diesel",
			distanceCovered: item.distance ?? 0,
			c02KgEmitted: item.emissions ?? 0,
			unitOfDistance: "km",
			vehicleNoPlate: item.vehicleNoPlate,
		}));

		setIsSaving(true);
		try {
			const response = await saveBulkFleetInfo(session?.user?.company?.id, dataToSend as any, session?.user?.id, "delivery-vehicles");

			if (response.status === "success") {
				toast.success("Data saved successfully", { duration: 5000, id });
				previewDisclosure.onClose();
			} else {
				toast.error("Failed to save data", { duration: 5000, id });
			}
		} catch (err) {
			console.error(err);
			toast.error("Failed to save data", { duration: 5000, id });
		} finally {
			setIsSaving(false);
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
										onClick={() => {
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
			<Modal isOpen={previewDisclosure.isOpen} onOpenChange={previewDisclosure.onOpenChange} size="5xl" isDismissable={false} scrollBehavior="inside">
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

export default UploadVehiclesEmissionsExcelSheetModal;
