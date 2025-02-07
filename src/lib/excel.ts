import ExcelJS from "exceljs";

type IVariant = "delivery-vehicles" | "passenger-vehicles";

export const generateDeliveryUploadExcelSheet = async (companyName: string) => {
	const workbook = new ExcelJS.Workbook();
	workbook.creator = "saastian";
	workbook.lastModifiedBy = "saastain";
	workbook.created = new Date();

	const worksheet = workbook.addWorksheet("Delivery Vehicles");

	worksheet.columns = [
		{ header: "Accounting Period", key: "date" },
		{ header: "Fleet Category", key: "category" },
		{ header: "Fuel Type", key: "fuelType" },
		{ header: "Distance Covered (KM)", key: "distance" },
		{ header: "Vehicle No. Plate", key: "vehicleNoPlate" },
	];

	worksheet.getRow(1).font = { bold: true };

	for (let row = 2; row <= 99999; row++) {
		worksheet.getCell(`A${row}`).dataValidation = {
			type: "date",
			operator: "between",
			showErrorMessage: true,
			errorTitle: "Invalid Date",
			error: "Date must be between 1st Jan 2020 and Today",
			formulae: [new Date(2020, 0, 1), new Date()],
		};
	}

	for (let row = 2; row <= 99999; row++) {
		worksheet.getCell(`B${row}`).dataValidation = {
			type: "list",
			formulae: ['"small,medium,large"'],
			allowBlank: true,
		};
	}

	for (let row = 2; row <= 99999; row++) {
		worksheet.getCell(`C${row}`).dataValidation = {
			type: "list",
			formulae: ['"Diesel,Petrol,CNG,LPG,Unknown,Average laden"'],
			allowBlank: true,
		};
	}

	for (let row = 2; row <= 99999; row++) {
		worksheet.getCell(`D${row}`).dataValidation = {
			type: "decimal",
			operator: "greaterThan",
			showErrorMessage: true,
			errorTitle: "Invalid Distance",
			error: "Distance must be greater than 0",
			formulae: [0],
		};
	}

	for (let row = 2; row <= 99999; row++) {
		worksheet.getCell(`E${row}`).dataValidation = {
			type: "textLength",
			operator: "between",
			showErrorMessage: true,
			errorTitle: "Invalid Vehicle No. Plate",
			error: "Vehicle No. Plate must be between 1 and 20 characters",
			formulae: [1, 20],
			allowBlank: true,
		};
	}
	// add column width
	worksheet.getColumn("date").width = 20;
	worksheet.getColumn("category").width = 20;
	worksheet.getColumn("fuelType").width = 20;
	worksheet.getColumn("distance").width = 20;

	workbook.modified = new Date();
	workbook.lastModifiedBy = "saastain";

	const filename = `${companyName}_Delivery_Vehicles_${new Date().toISOString()}.xlsx`;
	// generate and download the excel sheet
	workbook.xlsx.writeBuffer().then((buffer) => {
		const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = filename;
		a.click();
	});

	return filename;
};

type TExcelMetadata<T> = Record<IVariant, T>;

const columnsData = {
	["delivery-vehicles"]: [
		{ header: "Accounting Period", key: "date" },
		{ header: "Fleet Category", key: "category" },
		{ header: "Fuel Type", key: "fuelType" },
		{ header: "Distance Covered (KM)", key: "distance" },
		{ header: "Vehicle No. Plate", key: "vehicleNoPlate" },
	],
	["passenger-vehicles"]: [
		{ header: "Accounting Period", key: "date" },
		{ header: "Fleet Category", key: "category" },
		{ header: "Fuel Type", key: "fuelType" },
		{ header: "Distance Covered (KM)", key: "distance" },
		{ header: "Vehicle No. Plate", key: "vehicleNoPlate" },
	],
} satisfies TExcelMetadata<{ header: string; key: string }[]>;

export const advanceVehiclesExcelColumnsData = {
	["delivery-vehicles"]: [
		{ header: "ACCOUNTING PERIOD", key: "date" },
		{ header: "VEHICLE MAKE", key: "make" },
		{ header: "VEHICLE MODEL", key: "model" },
		{ header: "DISTANCE COVERED (KM)", key: "distance" },
		{ header: "VEHICLE REG NO", key: "vehicleNoPlate" },
	],
	["passenger-vehicles"]: [
		{ header: "ACCOUNTING PERIOD", key: "date" },
		{ header: "VEHICLE MAKE", key: "make" },
		{ header: "VEHICLE MODEL", key: "model" },
		{ header: "DISTANCE COVERED (KM)", key: "distance" },
		{ header: "VEHICLE REG NO", key: "vehicleNoPlate" },
	],
} satisfies TExcelMetadata<{ header: string; key: string }[]>;

const fleetCategoryOptions = {
	["delivery-vehicles"]: ["small", "medium", "large"],
	["passenger-vehicles"]: ["small car", "medium car", "large car", "average car", "Motorbike"],
} satisfies TExcelMetadata<string[]>;

const fuelTypeOptions = {
	["delivery-vehicles"]: ["Diesel", "Petrol", "CNG", "LPG", "Unknown", "Average laden"],
	["passenger-vehicles"]: ["Plug-in Hybrid", "Diesel", "Petrol", "Hybrid", "Unknown", "CNG", "LPG"],
} satisfies TExcelMetadata<string[]>;

const passengerVehicleInstructions = `Vehicle Emissions Data Upload \n. Insert data in the following format. Date, Fleet Category, Fuel Type, Distance Covered (KM), Vehicle No. Plate. Passenger Vehicles \n. Fleet Category: small car, medium car, large car, average car, Motorbike \n. Fuel Type: Plug-in Hybrid, Diesel, Petrol, Hybrid, Unknown, CNG, LPG\n. Motorbike fuel type is Petrol\n. As for small car and medium car: "Plug-in Hybrid", "Diesel", "Petrol", "Hybrid", "Unknown"\n. Large car and Average Car are: "Plug-in Hybrid", "Diesel", "Petrol", "Hybrid", "Unknown", "CNG", "LPG"\n. Distance covered must be greater than 0 (KM)\n. Accounting Period must be between 1st Jan 2020 and Today.`;
const deliveryVehicleInstructions = `Vehicle Emissions Data Upload \n. Insert data in the following format. Date, Fleet Category, Fuel Type, Distance Covered (KM), Vehicle No. Plate. Delivery Vehicles \n. Fleet Category: small, medium, large. Fuel Type: Diesel, Petrol, CNG, LPG, Unknown, Average laden\n. Distance covered must be greater than 0 (KM)\n. Accounting Period must be between 1st Jan 2020 and Today\n. Category Small fuel type is: Diesel, Petrol, CNG, LPG, Unknown. Medium and Large fuel type: Average laden\n. Small Cars are mostly Vans, Medium Cars are mostly Trucks, Large Cars are mostly Lorries. (HGV Diesel)`;

const instructions = {
	["delivery-vehicles"]: deliveryVehicleInstructions,
	["passenger-vehicles"]: passengerVehicleInstructions,
} satisfies TExcelMetadata<string>;

const sheetTitle = {
	["delivery-vehicles"]: "Delivery Vehicles",
	["passenger-vehicles"]: "Passenger Vehicles",
} satisfies TExcelMetadata<string>;

export const createVehicleUploadExcelSheet = async (companyName: string, variant: IVariant) => {
	const workbook = new ExcelJS.Workbook();
	workbook.creator = "saastian";
	workbook.lastModifiedBy = "saastain";
	workbook.created = new Date();

	const worksheet = workbook.addWorksheet(sheetTitle[variant], {
		pageSetup: {
			fitToPage: true,
			paperSize: 9,
			horizontalCentered: true,
			margins: {
				left: 0.1,
				right: 0.1,
				top: 1,
				bottom: 1,
				header: 1,
				footer: 0.3,
			},
		},
		headerFooter: {
			oddHeader: instructions[variant],
			evenHeader: instructions[variant],
		},
	});

	worksheet.columns = columnsData[variant];

	worksheet.getRow(1).font = { bold: true };

	const fleetCategory = fleetCategoryOptions[variant];
	const formattedFleetCategory = `"${fleetCategory.join(",")}"`;

	const fuelType = fuelTypeOptions[variant];
	const formattedFuelType = `"${fuelType.join(",")}"`;

	for (let row = 2; row <= 99999; row++) {
		worksheet.getCell(`A${row}`).dataValidation = {
			type: "date",
			operator: "between",
			showErrorMessage: true,
			errorTitle: "Invalid Date",
			error: "Date must be between 1st Jan 2020 and Today",
			formulae: [new Date(2020, 0, 1), new Date()],
		};
	}

	for (let row = 2; row <= 99999; row++) {
		worksheet.getCell(`B${row}`).dataValidation = {
			type: "list",
			formulae: [formattedFleetCategory],
			allowBlank: true,
		};
	}

	for (let row = 2; row <= 99999; row++) {
		worksheet.getCell(`C${row}`).dataValidation = {
			type: "list",
			formulae: [formattedFuelType],
			allowBlank: true,
		};
	}

	for (let row = 2; row <= 99999; row++) {
		worksheet.getCell(`D${row}`).dataValidation = {
			type: "decimal",
			operator: "greaterThan",
			showErrorMessage: true,
			errorTitle: "Invalid Distance",
			error: "Distance must be greater than 0",
			formulae: [0],
		};
	}

	for (let row = 2; row <= 99999; row++) {
		worksheet.getCell(`E${row}`).dataValidation = {
			type: "textLength",
			operator: "between",
			showErrorMessage: true,
			errorTitle: "Invalid Vehicle No. Plate",
			error: "Vehicle No. Plate must be between 1 and 20 characters",
			formulae: [1, 20],
			allowBlank: true,
		};
	}
	// add column width
	worksheet.getColumn("date").width = 20;
	worksheet.getColumn("category").width = 20;
	worksheet.getColumn("fuelType").width = 20;
	worksheet.getColumn("distance").width = 20;
	worksheet.getColumn("vehicleNoPlate").width = 20;

	workbook.modified = new Date();
	workbook.lastModifiedBy = "saastain";

	const formattedCompanyName = companyName.replace(/\s/g, "_");
	const filename = `${formattedCompanyName}_${variant === "delivery-vehicles" ? "Delivery" : "Passenger"}_Vehicles_${new Date().toISOString()}.xlsx`;

	// generate and download the excel sheet
	workbook.xlsx.writeBuffer().then((buffer) => {
		const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = filename;
		a.click();
	});
};

export const generateMongoData = (workbookData: { role: string; candidates: string[] }[]) => {
	const workbook = new ExcelJS.Workbook();

	const worksheet = workbook.addWorksheet("Resumes");

	workbookData.forEach((item, colIndex) => {
		worksheet.getCell(1, colIndex + 1).value = item.role;

		item.candidates.forEach((candidate, rowIndex) => {
			worksheet.getCell(rowIndex + 2, colIndex + 1).value = candidate;
		});
	});

	const filename = `resumes_mumzworld.xlsx`;
	workbook.xlsx
		.writeFile(filename)
		.then(() => {
			console.log("Excel File Created");
		})
		.catch((err) => {
			console.log("Failed to create the file ASAP.");
		});
};

export const createAdvanceVehicleUploadExcelSheet = async (companyName: string, variant: IVariant) => {
	const workbook = new ExcelJS.Workbook();
	workbook.creator = "saastian";
	workbook.lastModifiedBy = "saastain";
	workbook.created = new Date();

	const worksheet = workbook.addWorksheet(sheetTitle[variant], {
		pageSetup: {
			fitToPage: true,
			paperSize: 9,
			horizontalCentered: true,
			margins: {
				left: 0.1,
				right: 0.1,
				top: 1,
				bottom: 1,
				header: 1,
				footer: 0.3,
			},
		},
		headerFooter: {
			oddHeader: instructions[variant],
			evenHeader: instructions[variant],
		},
	});

	worksheet.columns = advanceVehiclesExcelColumnsData[variant];

	worksheet.getRow(1).font = { bold: true };

	for (let row = 2; row <= 999; row++) {
		worksheet.getCell(`A${row}`).dataValidation = {
			type: "date",
			operator: "between",
			showErrorMessage: true,
			errorTitle: "Invalid Date",
			error: "Date must be between 1st Jan 2020 and Today",
			formulae: [new Date(2020, 0, 1), new Date()],
		};
	}

	for (let row = 2; row <= 999; row++) {
		worksheet.getCell(`B${row}`).dataValidation = {
			type: "textLength",
			operator: "between",
			showErrorMessage: true,
			errorTitle: "Invalid Vehicle Make",
			error: "Vehicle Make must be between 1 and 20 characters",
			formulae: [1, 20],
			allowBlank: true,
		};
	}

	for (let row = 2; row <= 999; row++) {
		worksheet.getCell(`C${row}`).dataValidation = {
			type: "textLength",
			operator: "between",
			showErrorMessage: true,
			errorTitle: "Invalid Vehicle Model",
			error: "Vehicle Model must be between 1 and 20 characters",
			formulae: [1, 20],
			allowBlank: true,
		};
	}

	for (let row = 2; row <= 999; row++) {
		worksheet.getCell(`D${row}`).dataValidation = {
			type: "decimal",
			operator: "greaterThan",
			showErrorMessage: true,
			errorTitle: "Invalid Distance",
			error: "Distance must be greater than 0",
			formulae: [0],
		};
	}

	for (let row = 2; row <= 999; row++) {
		worksheet.getCell(`E${row}`).dataValidation = {
			type: "textLength",
			operator: "between",
			showErrorMessage: true,
			errorTitle: "Invalid Vehicle No. Plate",
			error: "Vehicle No. Plate must be between 1 and 20 characters",
			formulae: [1, 20],
			allowBlank: true,
		};
	}

	// add column width
	worksheet.getColumn("date").width = 20;
	worksheet.getColumn("make").width = 20;
	worksheet.getColumn("model").width = 20;
	worksheet.getColumn("distance").width = 20;
	worksheet.getColumn("vehicleNoPlate").width = 20;

	workbook.modified = new Date();
	workbook.lastModifiedBy = "saastain";

	const formattedCompanyName = companyName.replace(/\s/g, "_");
	const filename = `${formattedCompanyName}_${variant === "delivery-vehicles" ? "Delivery" : "Passenger"}_Vehicles_By_Make_Model_${new Date().toISOString()}.xlsx`;

	// generate and download the excel sheet
	workbook.xlsx.writeBuffer().then((buffer) => {
		const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = filename;
		a.click();
	});
};
