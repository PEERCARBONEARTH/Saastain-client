"use client";
import AppInput from "@/components/forms/AppInput";
import AppSelect from "@/components/forms/AppSelect";
import AppTextArea from "@/components/forms/AppTextArea";
import { generateOptions } from "@/utils";
import { BreadcrumbItem, Breadcrumbs, Button, ButtonGroup, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Spacer, Tooltip } from "@nextui-org/react";
import { ChevronDownIcon, TrashIcon, XIcon } from "lucide-react";
import Image from "next/image";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { HiOutlineCloudUpload } from "react-icons/hi";
import { Key } from "@react-types/shared";
import AppTable, { IAppTableColumn } from "@/components/table/AppTable";
import AddProductVariantModal from "@/components/models/AddProductVariantModal";

const categories = ["Clean Cooking", "Solar"];
const sdgs = ["SDG 1", "SDG 2"];

const productVariantsColumns: IAppTableColumn[] = [
	{
		name: "Variant",
		uid: "variant",
	},
	{
		name: "Capacity",
		uid: "capacity",
	},
	{
		name: "Actions",
		uid: "actions",
	},
];

interface IProductVariant {
	id?: string;
	variant: string;
	capacity: string;
}

const productVariants = [
	{
		id: "1",
		variant: "Smart Jiko",
		capacity: "5kg",
	},
	{
		id: "2",
		variant: "Mobile Jiko",
		capacity: "10kg",
	},
	{
		id: "3",
		variant: "Jikokoa Plus",
		capacity: "15kg",
	},
	{
		id: "4",
		variant: "Jikokoa Xtra",
		capacity: "20kg",
	},
] satisfies IProductVariant[];

const NewProduct = () => {
	const [selectedOption, setSelectedOption] = useState(new Set(["save"]));

	const descriptionsMap = {
		save: "Saves all the details of the product and publishes a new product.",
		draft: "Saves the current product as a draft. You can come back and publish it later.",
	};

	const labelsMap = {
		save: "Save & Publish",
		draft: "Save as Draft",
	};

	// Convert the Set to an Array and get the first value.
	const selectedOptionValue = Array.from(selectedOption)[0];

	const onDrop = useCallback((acceptedFiles: File[]) => {}, []);

	const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

	const renderCell = useCallback((item: IProductVariant, columnKey: Key) => {
		switch (columnKey) {
			case "variant":
				return item.variant;
			case "capacity":
				return item.capacity;
			case "actions":
				return (
					<Tooltip content={"Remove variant"}>
						<Button color="primary" variant="flat" size="sm" isIconOnly>
							<TrashIcon className="w-4 h-4" />
						</Button>
					</Tooltip>
				);
			default:
				return null;
		}
	}, []);

	return (
		<>
			<Breadcrumbs>
				<BreadcrumbItem>Vendor</BreadcrumbItem>
				<BreadcrumbItem>New Product</BreadcrumbItem>
			</Breadcrumbs>
			<div className="space-y-4 mt-8">
				<h1 className="font-bold text-2xl">Add Product</h1>
				<div className="w-full md:w-[80%]">
					<p>
						Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae
						dicta sunt explicabo
					</p>
				</div>
			</div>
			<div className="mt-8">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-10">
					<div className="px-4 py-6 rounded-2xl border border-gray-200">
						<h2 className="text-gray-900 font-semibold">Product Description</h2>
						<div className="mt-10">
							<AppInput label={"Product Name"} placeholder="Meko Clean Cooking System" baseInputClassName={'saastain'} />
							<Spacer y={6} />
							<AppTextArea label="About the product" placeholder="Write text here ..." minRows={7} />
							<Spacer y={6} />
							<AppTextArea label="What does it do?" placeholder="Write text here ..." minRows={7} />
						</div>
					</div>
					<div className="px-4 py-6 rounded-2xl border border-gray-200">
						<h2 className="text-gray-900 font-semibold">Product Images</h2>
						<div className="grid grid-cols-2 gap-4 md:min-h-[400px] h-full py-6">
							<div className="flex flex-col gap-5">
								<div className="border h-full border-dashed border-primary flex items-center justify-center p-4 text-center rounded-xl cursor-pointer" {...getRootProps()}>
									<input {...getInputProps()} />
									{isDragActive ? (
										<p>Drop files here ...</p>
									) : (
										<div className="flex flex-col items-center gap-3">
											<HiOutlineCloudUpload className="w-8 h-8" />
											<p className="text-primary">Click to upload your images or drag and drop</p>
										</div>
									)}
								</div>
								<div className="relative group">
									<Image src={"/images/jikokoa.jpeg"} className="w-full rounded-xl" width={150} height={150} alt="Jiko" />
									<div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity opacity-0 group-hover:opacity-100 rounded-xl">
										<div className="flex flex-col h-full p-2 items-end justify-end">
											<Tooltip content={"Remove image"}>
												<Button color="danger" variant="flat" isIconOnly>
													<TrashIcon />
												</Button>
											</Tooltip>
										</div>
									</div>
								</div>
							</div>
							<div className="flex flex-col gap-3">
								<Image src={"/images/jiko.jpg"} className="rounded-xl" width={250} height={200} alt="Jiko" />
								<Image src={"/images/jiko.jpg"} className="rounded-xl" width={250} height={200} alt="Jiko" />
								<Image src={"/images/jiko.jpg"} className="rounded-xl" width={250} height={200} alt="Jiko" />
							</div>
						</div>
					</div>
				</div>
			</div>
			<div className="mt-8">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-10">
					<div className="px-4 py-6 rounded-2xl border border-gray-200">
						<h2 className="text-gray-900 font-semibold">Advantages & Challeges</h2>
						<div className="mt-10 mb-5">
							<AppTextArea label="What are the advantages of using your product?" placeholder="Write text here ..." minRows={5} />
							<Spacer y={6} />
							<AppTextArea label="What are some of the challenges using your product" placeholder="Write text here ..." minRows={5} />
						</div>
						<div className="flex items-center justify-end">
							<Button startContent={<HiOutlineCloudUpload />} size="sm" color="primary" variant="light">
								Upload .txt file
							</Button>
						</div>
					</div>
					<div className="px-4 py-6 rounded-2xl border border-gray-200">
						<h2 className="text-gray-900 font-semibold">Category</h2>
						<div className="mt-10">
							<AppSelect label="Product Category" options={generateOptions(categories)} />
							<Spacer y={6} />
							<AppSelect label="Which SDG  does your product impact" options={generateOptions(sdgs)} />
						</div>
					</div>
				</div>
			</div>
			<div className="mt-8">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-10">
					<div className="px-4 py-6 rounded-2xl border border-gray-200">
						<div className="flex items-center justify-between">
							<h2 className="text-gray-900 font-semibold">Product Variants</h2>
							<AddProductVariantModal />
						</div>
						<div className="mt-10">
							<AppTable<IProductVariant>
								headerColumns={productVariantsColumns}
								data={productVariants}
								renderCell={renderCell}
								isLoading={false}
								title="Products"
								count={productVariants.length}
								showBottomContent={false}
								showTopContent={false}
							/>
						</div>
					</div>
					<div>
						<div className="flex items-center justify-end gap-x-6">
							<Button startContent={<XIcon />}>Cancel</Button>
							<ButtonGroup color="primary">
								<Button>{labelsMap[selectedOptionValue]}</Button>
								<Dropdown placement="bottom-end">
									<DropdownTrigger>
										<Button isIconOnly>
											<ChevronDownIcon />
										</Button>
									</DropdownTrigger>
									<DropdownMenu
										disallowEmptySelection
										aria-label="saves options"
										selectedKeys={selectedOption}
										selectionMode="single"
										onSelectionChange={setSelectedOption as any}
										className="max-w-[300px] saastain font-nunito">
										<DropdownItem key="save" description={descriptionsMap["save"]}>
											{labelsMap["save"]}
										</DropdownItem>
										<DropdownItem key="draft" description={descriptionsMap["draft"]}>
											{labelsMap["draft"]}
										</DropdownItem>
									</DropdownMenu>
								</Dropdown>
							</ButtonGroup>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default NewProduct;
