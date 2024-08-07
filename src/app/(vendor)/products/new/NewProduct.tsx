"use client";
import AppInput from "@/components/forms/AppInput";
import AppSelect from "@/components/forms/AppSelect";
import { generateOptions } from "@/utils";
import { BreadcrumbItem, Breadcrumbs, Button, ButtonGroup, Card, CircularProgress, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Skeleton, Spacer, Tooltip } from "@nextui-org/react";
import { ChevronDownIcon, TrashIcon, XIcon } from "lucide-react";
import Image from "next/image";
import { FC, ReactNode, useCallback, useEffect, useMemo, useState } from "react";
import { ErrorCode, useDropzone } from "react-dropzone";
import { HiOutlineCloudUpload } from "react-icons/hi";
import { Key } from "@react-types/shared";
import AppTable, { IAppTableColumn } from "@/components/table/AppTable";
import AddProductVariantModal from "@/components/models/AddProductVariantModal";
import dynamic from "next/dynamic";
import useSWR from "swr";
import { IGreenCategory } from "@/types/GreenCategory";
import { IApiEndpoint } from "@/types/Api";
import { swrFetcher } from "@/lib/api-client";
import { ISDG } from "@/types/SDG";
import AppMultiSelect from "@/components/forms/AppMultiSelect";
import { z } from "zod";
import { FieldError, FormProvider, useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { firebaseStorage } from "@/lib/firebase";
import { useSession } from "next-auth/react";
import useDidHydrate from "@/hooks/useDidHydrate";
import { nanoid } from "nanoid";
import { cn, getFileSize } from "@/lib/utils";
import useProductUtils, { ISaveGreenProduct } from "@/hooks/useProductUtils";
import { GreenProductStatus } from "@/types/GreenProduct";
import { useRouter } from "next/navigation";
import { AppEnumRoutes } from "@/types/AppEnumRoutes";
import TextEditorSkeletonLoader from "@/components/text-editor/TextEditorSkeleton";

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB in bytes

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

interface IFileUploadProgress {
	name: string;
	size: string;
	message: string;
	progress: number;
	id: string;
}

const imagesSchema = z.object({
	uploadId: z.string(),
	url: z.string(),
	blurUrl: z.string(),
});

interface NewProductSectionContainerProps {
	title: string;
	children: ReactNode;
	actionBtn?: ReactNode;
	childrenClassName?: string;
	otherChildren?: ReactNode;
	sectionErrors?: ReactNode;
}

const newProductFormSchema = z
	.object({
		name: z.string().min(3, "Product Name is required"),
		description: z.string().min(10, "Please describe what the product is about"),
		howItWorks: z.string().min(10, "Please describe how your product works"),
		advantages: z.string().min(10, "Advantages are required"),
		disadvantages: z.string().min(10, "Disadvantages are required"),
		priceRangeMin: z.coerce.number().min(0, "Please enter min price range"),
		priceRangeMax: z.coerce.number().min(10, "Max price range is required"),
		categories: z.string().min(1, "Please select your product category"),
		sdg: z
			.array(z.object({ value: z.string(), label: z.string() }))
			.nonempty({ message: "Please select SDG for your product" })
			.min(1, "Please select SDG for your product"),
		images: z.array(imagesSchema).nonempty({ message: "Please upload images of your product" }).min(3, "Please upload at least 3 images of your product"),
	})
	.refine((data) => data.priceRangeMin <= data.priceRangeMax, {
		message: "Min price range cannot be greater than max price range",
		path: ["priceRangeMin"], // This will highlight the priceRangeMin field in case of an error
	});
const NewProduct = () => {
	/**
	 * Import Text Editor on the client side without server side effects
	 */
	const AppTextEditor = useMemo(() => {
		return dynamic(() => import("@/components/text-editor/AppTextEditor"), {
			ssr: false,
			loading: () => <TextEditorSkeletonLoader />,
		});
	}, []);
	const [selectedOption, setSelectedOption] = useState(new Set(["save"]));
	const [productVariantsItems, setProductVariantsItems] = useState<{ variant: string; capacity: string; id: string }[]>([]);
	const [filesUploadProgress, setFilesUploadProgress] = useState<IFileUploadProgress[]>([]);
	const [myUploadedFiles, setMyUploadedFiles] = useState<{ name: string; url: string; uploadId: string; blurImageUrl: string }[]>([]);
	const [isSaving, setIsSaving] = useState<boolean>(false);

	const { data: session } = useSession();
	const { didHydrate } = useDidHydrate();
	const { saveNewGreenProduct } = useProductUtils();
	const router = useRouter();

	const account = useMemo(() => {
		if (didHydrate && session?.user) {
			return session?.user;
		}

		return null;
	}, [session]);

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

	const updateFileUploadProgress = (id: string, progress: number, message: string) => {
		setFilesUploadProgress((prev) => prev.map((file) => (file.id === id ? { ...file, progress, message } : file)));
	};

	const formMethods = useForm<z.infer<typeof newProductFormSchema>>({
		resolver: zodResolver(newProductFormSchema),
		defaultValues: {
			name: "",
			description: "",
			howItWorks: "",
			advantages: "",
			disadvantages: "",
			priceRangeMax: 0,
			priceRangeMin: 0,
			categories: "",
			images: [],
			sdg: [],
		},
	});

	const {
		handleSubmit,
		reset,
		control,
		formState: { errors: formErrors },
		setValue,
		watch,
	} = formMethods;

	const { fields, append, remove } = useFieldArray({ control, name: "images" });

	const onRemoveImage = (fieldIdx: number, uploadId: string) => {
		remove(fieldIdx);
		const newUploadProgressArr = filesUploadProgress.filter((item) => item.id !== uploadId);
		setFilesUploadProgress(newUploadProgressArr);
	};

	const onRemoveVariant = (id: string) => {
		const items = [...productVariantsItems];
		const remainingItems = items.filter((item) => item.id !== id);

		setProductVariantsItems(remainingItems);
	};

	const renderCell = useCallback((item: IProductVariant, columnKey: Key) => {
		switch (columnKey) {
			case "variant":
				return item.variant;
			case "capacity":
				return item.capacity;
			case "actions":
				return (
					<Tooltip content={"Remove variant"}>
						<Button color="primary" variant="flat" size="sm" onPress={() => onRemoveVariant(item.id)} isIconOnly>
							<TrashIcon className="w-4 h-4" />
						</Button>
					</Tooltip>
				);
			default:
				return null;
		}
	}, []);

	const { data: productCategories, isLoading: loadingCategories } = useSWR<IGreenCategory[]>([IApiEndpoint.GET_GREEN_PRODUCT_CATEGORIES], swrFetcher, { keepPreviousData: true });
	const { data: loadedSDGS } = useSWR<ISDG[]>([IApiEndpoint.GET_SDGS], swrFetcher, { keepPreviousData: true });

	const categoriesOpts = useMemo(() => {
		if (productCategories && productCategories?.length > 0) {
			const opts = productCategories.map((item) => item.title);

			return generateOptions(opts);
		}

		return [];
	}, [productCategories]);

	const sdgOpts = useMemo(() => {
		if (loadedSDGS && loadedSDGS?.length > 0) {
			const opts = loadedSDGS?.map((item) => {
				return {
					label: `${item.title} - ${item.description}`,
					value: item.title,
				};
			});

			return opts;
		}

		return [];
	}, [loadedSDGS]);

	const onDrop = (acceptedFiles: File[]) => {
		// we need to upload
		const uploadPromises = acceptedFiles.map((file) => {
			const fileNameWithoutExt = file.name.split(".").slice(0, -1).join(".");
			const fileExt = file.name.split(".").pop();
			const unique_file_name = `${fileNameWithoutExt}_${nanoid(6)}_.${fileExt}`;
			const storageRef = ref(firebaseStorage, `products/images/${account?.vendorProfile?.id}/${unique_file_name}`);

			const uploadTask = uploadBytesResumable(storageRef, file);

			const uploadId = nanoid(10);

			setFilesUploadProgress((prev) => [
				...prev,
				{
					name: file.name,
					size: getFileSize(file.size),
					message: "Uploading in progress",
					progress: 0,
					id: uploadId,
				},
			]);

			const blurImageDataUrl = URL.createObjectURL(file);

			append({ uploadId: uploadId, url: blurImageDataUrl, blurUrl: blurImageDataUrl });

			return new Promise<{ name: string; url: string; uploadId: string; blurImageUrl: string }>((resolve, reject) => {
				uploadTask.on(
					"state_changed",
					(snapshot) => {
						const progress = Math.round(snapshot.bytesTransferred / snapshot.totalBytes) * 100;

						updateFileUploadProgress(uploadId, progress, "Uploading in progress");

						switch (snapshot.state) {
							case "paused":
								updateFileUploadProgress(uploadId, progress, "Uploading paused");
								break;
							case "running":
								updateFileUploadProgress(uploadId, progress, "Uploading in progress");
								break;
							case "canceled":
								updateFileUploadProgress(uploadId, progress, "Upload cancelled");
								break;
						}
					},
					(error) => {
						updateFileUploadProgress(uploadId, 0, "Upload failed");
						reject(error);
					},
					() => {
						getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
							updateFileUploadProgress(uploadId, 100, "Upload complete");
							resolve({ name: file.name, url: downloadURL, uploadId, blurImageUrl: blurImageDataUrl });
						});
					}
				);
			});
		});

		Promise.all(uploadPromises).then((uploadedFiles) => {
			setMyUploadedFiles(uploadedFiles);
		});
	};

	const updateImageUrl = () => {
		const uploadedFiles = [...myUploadedFiles];
		uploadedFiles.forEach((item) => {
			const idx = fields.findIndex((field) => field.uploadId === item.uploadId);
			setValue(`images.${idx}.url`, item.url);
		});
		setMyUploadedFiles([]);
	};

	useEffect(() => {
		if (myUploadedFiles && myUploadedFiles?.length > 0) {
			updateImageUrl();
		}
	}, [myUploadedFiles]);

	const imageSizeValidator = (file: File) => {
		if (file.size > MAX_FILE_SIZE_BYTES) {
			return {
				code: ErrorCode.FileTooLarge,
				message: "Image is larger tham 10MB",
			};
		}

		return null;
	};

	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		onDrop,
		accept: {
			"image/jpeg": [],
			"image/png": [],
		},
		validator: imageSizeValidator,
	});

	const onSubmitForm = async (data: z.infer<typeof newProductFormSchema>) => {
		if (!productVariantsItems || productVariantsItems?.length <= 0) {
			toast.error("Please enter at least one product variant");
			return;
		}

		const newImages = data.images?.map((img) => {
			return { id: img.uploadId, url: img.url };
		});

		const newProductVariants = productVariantsItems.map((item) => {
			return {
				variant: item.variant,
				capacity: item.capacity,
			};
		});

		const sdgs = data.sdg as { value: string; label: string }[];

		const selectedSDGs = loadedSDGS.filter((item) => sdgs.some((sdg) => sdg.value === item.title));

		const sdgsToSave = selectedSDGs.map((item) => ({ id: item.id, title: item.title }));

		const info: ISaveGreenProduct = {
			name: data.name,
			description: data.description,
			howItWorks: data.howItWorks,
			advantages: data.advantages,
			disadvantages: data.disadvantages,
			priceRangeMin: data.priceRangeMin,
			priceRangeMax: data.priceRangeMax,
			categories: data.categories,
			sdg: sdgsToSave,
			productVariant: newProductVariants,
			images: newImages,
			vendorId: account?.vendorProfile?.id,
			status: selectedOptionValue === "draft" ? GreenProductStatus.DRAFT : GreenProductStatus.PUBLISHED,
		};

		setIsSaving(true);

		try {
			const resp = await saveNewGreenProduct(info);

			if (resp.status === "success") {
				toast.success(`Product Saved Successfully as ${selectedOptionValue === "draft" ? "Draft" : "Published"}`);
				reset();
				setProductVariantsItems([]);
				router.push(AppEnumRoutes.APP_PRODUCTS);
			} else {
				toast.error("Unable to save the product at the moment");
			}
		} catch (err) {
			toast.error("Unable to save the product at the moment");
		} finally {
			setIsSaving(false);
		}
	};

	const images = watch("images");

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
			<FormProvider {...formMethods}>
				<form onSubmit={handleSubmit(onSubmitForm)}>
					<div className="mt-8">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-10">
							<div className="space-y-10">
								<NewProductSectionContainer title="Product Description">
									<AppInput label={"Product Name"} placeholder="Meko Clean Cooking System" baseInputClassName={"saastain font-nunito"} name="name" control={control} error={formErrors.name} />
									<Spacer y={6} />
									<AppTextEditor label="About the product" placeholer="Write text here ..." name="description" control={control} error={formErrors.description} />
									<Spacer y={6} />
									<AppTextEditor label="What does it do?" placeholer="Write text here ..." name="howItWorks" control={control} error={formErrors.howItWorks} />
								</NewProductSectionContainer>
								<NewProductSectionContainer
									title="Advantages & Challenges"
									childrenClassName="mb-5"
									otherChildren={
										<div className="flex items-center justify-end">
											<Button startContent={<HiOutlineCloudUpload />} type="button" size="sm" color="primary" variant="light">
												Upload .txt file
											</Button>
										</div>
									}>
									<AppTextEditor label="What are the advantages of using your product?" placeholer="Write text here ..." name="advantages" control={control} error={formErrors.advantages} />
									<Spacer y={6} />
									<AppTextEditor label="What are some of the challenges using your product" placeholer="Write text here ..." name="disadvantages" control={control} error={formErrors.disadvantages} />
								</NewProductSectionContainer>
							</div>
							<div className="space-y-10">
								<NewProductSectionContainer
									title="Product Images"
									childrenClassName="mt-0"
									sectionErrors={<>{formErrors?.images && <p className="text-sm text-danger">{(formErrors?.images as FieldError)?.message}</p>}</>}>
									<>
										<div className="columns-2 gap-5 overflow-y-scroll max-h-[600px] h-full">
											{fields.map((field, idx) => (
												<div className="break-inside-avoid mb-4">
													<div key={field.id} className="relative group">
														<Image src={images[idx].url} className="w-full rounded-xl" width={180} height={180} alt="Jiko" placeholder="blur" blurDataURL={field.blurUrl} />
														<div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity opacity-0 group-hover:opacity-100 rounded-xl">
															<div className="flex flex-col h-full p-2 items-end justify-end">
																<Tooltip content={"Remove image"}>
																	<Button
																		onPress={() => {
																			onRemoveImage(idx, field.uploadId);
																		}}
																		color="danger"
																		variant="flat"
																		isIconOnly>
																		<TrashIcon />
																	</Button>
																</Tooltip>
															</div>
														</div>
													</div>
												</div>
											))}
										</div>
										<div className="border border-dashed border-primary flex items-center justify-center p-4 text-center rounded-xl cursor-pointer mt-2" {...getRootProps()}>
											<input {...getInputProps()} />
											{isDragActive ? (
												<p>Drop files here ...</p>
											) : (
												<div className="flex flex-col items-center gap-3">
													<HiOutlineCloudUpload className="w-8 h-8" />
													<p className="text-primary">Click to upload your images or drag and drop</p>
													<em className="text-sm">(Accepting Only Images of format (.jpeg, .jpg or .png) and of less than 10MB )</em>
												</div>
											)}
										</div>
										<div className="mt-2 space-y-2">
											{filesUploadProgress?.map((uploadProgress) => (
												<div key={uploadProgress.id} className="flex items-center gap-2 px-2 py-3 border rounded-xl">
													<CircularProgress aria-label="Loading..." size="lg" value={uploadProgress?.progress} color="warning" showValueLabel={true} />
													<div>
														<p className="text-sm font-semibold">
															{uploadProgress?.message} for {uploadProgress.name}
														</p>
														<p className="text-sm">{uploadProgress?.size}</p>
													</div>
												</div>
											))}
										</div>
									</>
								</NewProductSectionContainer>
								<NewProductSectionContainer title="Category">
									<AppSelect label="Product Category" options={categoriesOpts} name="categories" error={formErrors.categories} control={control} />
									<Spacer y={6} />
									<AppMultiSelect label="Which SDG  does your product impact" placeholder="Select one or more SDG item" options={sdgOpts} name="sdg" control={control} error={formErrors.sdg as any} />
								</NewProductSectionContainer>
								<NewProductSectionContainer title="Product Variants" actionBtn={<AddProductVariantModal setProductVariants={setProductVariantsItems} />}>
									<AppTable<IProductVariant>
										headerColumns={productVariantsColumns}
										data={productVariantsItems ?? []}
										renderCell={renderCell}
										isLoading={false}
										title="Products"
										count={productVariantsItems?.length ?? 0}
										showBottomContent={false}
										showTopContent={false}
									/>
								</NewProductSectionContainer>
								<NewProductSectionContainer title="Price Ranges">
									<AppInput label={"Min Price"} placeholder="Minimum Price" type={"number"} name="priceRangeMin" control={control} error={formErrors.priceRangeMin} />
									<Spacer y={6} />
									<AppInput label={"Max Price"} placeholder="Maximum Price" type={"number"} name="priceRangeMax" control={control} error={formErrors.priceRangeMax} />
								</NewProductSectionContainer>
								<div className="flex items-center justify-end gap-x-6">
									<Button type="button" startContent={<XIcon />}>
										Cancel
									</Button>
									<ButtonGroup color="primary">
										<Button isDisabled={isSaving} isLoading={isSaving} type="submit">
											{labelsMap[selectedOptionValue]}
										</Button>
										<Dropdown placement="bottom-end">
											<DropdownTrigger type="button">
												<Button type="button" isIconOnly>
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
				</form>
			</FormProvider>
		</>
	);
};


const NewProductSectionContainer: FC<NewProductSectionContainerProps> = ({ title, actionBtn, children, childrenClassName, otherChildren, sectionErrors }) => {
	return (
		<div className="px-4 py-6 rounded-2xl border border-gray-200">
			<div className="flex items-center justify-between">
				<h2 className="text-gray-900 font-semibold">{title}</h2>
				{actionBtn}
			</div>
			{sectionErrors}
			<div className={cn("mt-10", childrenClassName)}>{children}</div>
			{otherChildren}
		</div>
	);
};

export default NewProduct;
