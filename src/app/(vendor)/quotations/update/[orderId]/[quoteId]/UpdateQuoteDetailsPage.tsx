"use client";
import AppInput from "@/components/forms/AppInput";
import AppSelect from "@/components/forms/AppSelect";
import TextEditorSkeletonLoader from "@/components/text-editor/TextEditorSkeleton";
import useDidHydrate from "@/hooks/useDidHydrate";
import useOrderUtils from "@/hooks/useOrderUtils";
import { swrFetcher } from "@/lib/api-client";
import { firebaseStorage } from "@/lib/firebase";
import { getFileSize } from "@/lib/utils";
import { IApiEndpoint } from "@/types/Api";
import { AppEnumRoutes } from "@/types/AppEnumRoutes";
import { IOrder, OrderStage } from "@/types/Order";
import { generateOptions } from "@/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Card, CardBody, CardFooter, CardHeader, Chip, CircularProgress, Spacer } from "@nextui-org/react";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { TrashIcon } from "lucide-react";
import { nanoid } from "nanoid";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { FC, Fragment, useEffect, useMemo, useState } from "react";
import { ErrorCode, useDropzone } from "react-dropzone";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { HiCheck, HiOutlineCloudUpload, HiOutlineExternalLink, HiPlus, HiX } from "react-icons/hi";
import useSWR from "swr";
import { z } from "zod";

interface IProps {
	orderId: string;
	quoteId: string;
}

interface IFileUploadProgress {
	name: string;
	size: string;
	message: string;
	progress: number;
	id: string;
}

const documentsSchema = z.object({
	uploadId: z.string(),
	url: z.string(),
	blurUrl: z.string(),
	name: z.string(),
});

const MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024; // 50MB in bytes

const formSchema = z.object({
	totalArea: z.string().min(1, "Total Area is required"),
	installationCost: z.coerce.number().min(1, "Installation cost is required"),
	maintenanceCost: z.coerce.number().min(0, "Maintenance Cost cannot be less than 0"),
	anyOtherFeedBack: z.string(),
	variantItems: z
		.array(
			z.object({
				variant: z.string().min(1, "Select Variant"),
				quantity: z.coerce.number().min(1, "Quantity cannot be less than 1"),
				unitPrice: z.coerce.number().min(1, "Unit price cannot be less than 1"),
			})
		)
		.nonempty({ message: "Please add atleast one variant item" })
		.min(1, "Please add atleast one variant item"),
	documents: z.array(documentsSchema),
});

const UpdateQuoteDetailsPage: FC<IProps> = ({ orderId, quoteId }) => {
	const router = useRouter();

	const AppTextEditor = useMemo(() => {
		return dynamic(() => import("@/components/text-editor/AppTextEditor"), {
			ssr: false,
			loading: () => <TextEditorSkeletonLoader />,
		});
	}, []);
	const [filesUploadProgress, setFilesUploadProgress] = useState<IFileUploadProgress[]>([]);
	const [myUploadedFiles, setMyUploadedFiles] = useState<{ name: string; url: string; uploadId: string; blurDocumentUrl: string }[]>([]);
	const [loading, setLoading] = useState<boolean>(false);

	const { data: session } = useSession();
	const { didHydrate } = useDidHydrate();
	const { updateNewQuotation, saveNewOrderTimeline } = useOrderUtils();

	const account = useMemo(() => {
		if (didHydrate && session?.user) {
			return session?.user;
		}

		return null;
	}, [session]);

	const formMethods = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			totalArea: "",
			installationCost: 1,
			maintenanceCost: 1,
			anyOtherFeedBack: "",
			variantItems: [
				{
					variant: "",
					quantity: 1,
					unitPrice: 1,
				},
			],
			documents: [],
		},
	});

	const {
		handleSubmit,
		control,
		formState: { errors: formErrors },
		reset,
		setValue,
		watch,
	} = formMethods;

	const { fields, append, remove } = useFieldArray({
		name: "variantItems",
		control,
	});

	const {
		fields: documentFields,
		append: appendDocument,
		remove: removeDocument,
	} = useFieldArray({
		name: "documents",
		control,
	});

	const updateFileUploadProgress = (id: string, progress: number, message: string) => {
		setFilesUploadProgress((prev) => prev.map((file) => (file.id === id ? { ...file, progress, message } : file)));
	};

	const onRemoveDocument = (fieldIdx: number, uploadId: string) => {
		removeDocument(fieldIdx);
		const newUploadProgressArr = filesUploadProgress.filter((item) => item.id !== uploadId);
		setFilesUploadProgress(newUploadProgressArr);
	};

	const documentSizeValidator = (file: File) => {
		if (file.size > MAX_FILE_SIZE_BYTES) {
			return {
				code: ErrorCode.FileTooLarge,
				message: "Image is larger tham 10MB",
			};
		}

		return null;
	};

	const onDrop = (acceptedFiles: File[]) => {
		const uploadPromises = acceptedFiles.map((file) => {
			const fileNameWithoutExt = file.name.split(".").slice(0, -1).join(".");
			const fileExt = file.name.split(".").pop();
			const unique_file_name = `${fileNameWithoutExt}_${nanoid(6)}_.${fileExt}`;

			const storageRef = ref(firebaseStorage, `orders/documents/${orderId}/${unique_file_name}`);

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

			const blurDocumentDataUrl = URL.createObjectURL(file);

			appendDocument({ uploadId: uploadId, url: blurDocumentDataUrl, blurUrl: blurDocumentDataUrl, name: file.name });

			return new Promise<{ name: string; url: string; uploadId: string; blurDocumentUrl: string }>((resolve, reject) => {
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
						getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
							updateFileUploadProgress(uploadId, 100, "Upload complete");
							resolve({ name: file.name, url: downloadUrl, uploadId, blurDocumentUrl: blurDocumentDataUrl });
						});
					}
				);
			});
		});

		Promise.all(uploadPromises).then((uploadedFiles) => {
			setMyUploadedFiles(uploadedFiles);
		});
	};

	const updateDocumentUrl = () => {
		const uploadedFiles = [...myUploadedFiles];
		uploadedFiles.forEach((item) => {
			const idx = documentFields.findIndex((field) => field.uploadId === item.uploadId);
			setValue(`documents.${idx}.url`, item.url);
		});
		setMyUploadedFiles([]);
	};

	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		onDrop,
		validator: documentSizeValidator,
	});

	useEffect(() => {
		if (myUploadedFiles && myUploadedFiles?.length > 0) {
			updateDocumentUrl();
		}
	}, [myUploadedFiles]);

	const usedVariants = watch("variantItems");

	const { data: orderDetails } = useSWR<IOrder>(!orderId ? null : [`${IApiEndpoint.GET_ORDER_DETAILS}/${orderId}`], swrFetcher, { keepPreviousData: true });

	const productVariantsOpts = useMemo(() => {
		if (orderDetails) {
			const prodVariant = orderDetails?.product?.productVariant;

			if (prodVariant?.length > 0) {
				return generateOptions(prodVariant?.map((item) => item.variant));
			}

			return [];
		}
		return [];
	}, [orderDetails, usedVariants]);

	const getAvailableVariants = (index: number) => {
		const selectedVariants = usedVariants.slice(0, index);
		const selectedVariantValues = selectedVariants.map((item) => item.variant);

		return productVariantsOpts.filter((option) => !selectedVariantValues.includes(option.value));
	};

	const totalArea = watch("totalArea");
	const maintenanceCost = watch("maintenanceCost");
	const installationCost = watch("installationCost");
	const allVariantItems = watch("variantItems");

	const actualCost = allVariantItems.reduce((total, item) => {
		return total + (item.unitPrice ?? 0) * (item.quantity ?? 0);
	}, 0);

	const totalCost = Number(actualCost) + Number(maintenanceCost) + Number(installationCost);

	const formatCurrency = (amount: number) => {
		return `Ksh ${new Intl.NumberFormat("en-KE").format(amount)}`;
	};

	const saveNewTimelineInfo = async () => {
		const info = {
			orderId,
			code: OrderStage.RFQ,
			title: "Quotation Updated",
			description: `${orderDetails?.vendor?.companyName} has updated quotation for ${orderDetails?.product?.name}`,
		};
		try {
			await saveNewOrderTimeline(info);
		} catch (err) {}
	};

	const onSubmit = async (data: z.infer<typeof formSchema>) => {
		setLoading(true);
		const variantsInfoToSave = data.variantItems.map((item) => {
			const code = nanoid(10);
			return {
				...item,
				code,
				status: "pending",
			};
		});

		const documentsInfoToSave = data.documents.map((doc) => {
			const info = {
				id: nanoid(10),
				name: doc.name,
				url: doc.url,
			};

			return info;
		});

		const computedActualCost = variantsInfoToSave?.reduce((total, item) => {
			return total + (item.unitPrice ?? 0) * (item?.quantity ?? 0);
		}, 0);

		const computedTotalCost = Number(computedActualCost) + Number(data.installationCost) + Number(data?.maintenanceCost);

		const infoToSave = {
			totalArea,
			variantsInfo: variantsInfoToSave,
			installationCost: Number(data.installationCost),
			maintenanceCost: Number(data?.maintenanceCost),
			totalCost: Number(computedTotalCost),
			documents: documentsInfoToSave,
			anyOtherFeedback: data.anyOtherFeedBack,
			addedBy: account?.id,
			orderId,
		};

		try {
			const resp = await updateNewQuotation(infoToSave as any);

			if (resp?.status === "success") {
				toast.success("Quotation Details Updated Successfully");
				saveNewTimelineInfo()
				reset();
				router.push(`${AppEnumRoutes.APP_ORDER_DETAILS}/${orderId}`);
			} else {
				toast.error(resp?.msg ?? "Unable to update quotation details");
			}
		} catch (err) {
			toast.error("Unable to update quotation details");
		} finally {
			setLoading(false);
		}
	};

	return (
		<>
			<div className="pb-2 border-b border-b-saastain-gray">
				<h1 className="text-green-800 text-2xl font-bold">Update Quotation Details</h1>
			</div>
			<div className="mt-5">
				<div className="grid grid-cols-1 md:grid-cols-12 gap-5">
					<div className="col-auto md:col-span-8">
						<FormProvider {...formMethods}>
							<form onSubmit={handleSubmit(onSubmit)}>
								<Card shadow="none" className="bg-transparent border">
									<CardBody>
										<AppInput
											name="totalArea"
											control={control}
											error={formErrors.totalArea}
											label={"What is the total area?"}
											placeholder="e.g. 672982"
											helperText="This is the installation area required"
										/>
										<Spacer y={5} />
										<div className="mb-2">
											<label className="block text-sm font-medium leading-6 text-gray-900">How many variants are needed?</label>
										</div>
										{fields.map((field, idx) => {
											const errForField = formErrors?.variantItems?.[idx];

											return (
												<Fragment key={field.id}>
													<div className="grid grid-cols-3 gap-2">
														<AppSelect label="Variant" options={getAvailableVariants(idx)} name={`variantItems.${idx}.variant`} control={control} error={errForField?.variant} />
														<AppInput type="number" label={"Quantity"} placeholder="1" name={`variantItems.${idx}.quantity`} control={control} error={errForField?.quantity as any} />
														<div className="flex items-end gap-2">
															<AppInput
																type="number"
																label={"Unit Price"}
																placeholder="100000"
																name={`variantItems.${idx}.unitPrice`}
																control={control}
																error={errForField?.unitPrice as any}
															/>
															{fields?.length > 1 && (
																<Button type="button" size="sm" color="danger" variant="flat" onPress={() => remove(idx)} isIconOnly>
																	<TrashIcon />
																</Button>
															)}
														</div>
													</div>
													<Spacer y={5} />
												</Fragment>
											);
										})}
										{fields?.length !== productVariantsOpts?.length && (
											<div className="grid grid-cols-2">
												<Button
													className="bg-green-100 text-green-700"
													endContent={<HiPlus />}
													type="button"
													onPress={() =>
														append({
															variant: "",
															quantity: 1,
															unitPrice: 1,
														})
													}>
													New Variant
												</Button>
											</div>
										)}
										<Spacer y={5} />
										<AppInput
											name="installationCost"
											control={control}
											error={formErrors.installationCost as any}
											label={"What is the installation cost?"}
											placeholder="e.g. 672982"
											helperText="How much will it cost to install?"
										/>
										<Spacer y={5} />
										<AppInput
											name="maintenanceCost"
											control={control}
											error={formErrors.maintenanceCost as any}
											label={"What is the maintenance cost?"}
											placeholder="e.g. 672982"
											helperText="How much will it cost to maintain?"
										/>
										<Spacer y={5} />
										<div className="mb-2">
											<p className="text-sm font-medium">Upload any Documents or Files</p>
										</div>
										<div className="border border-dashed border-primary flex items-center justify-center p-4 text-center rounded-xl cursor-pointer mt-2" {...getRootProps()}>
											<input {...getInputProps()} />
											{isDragActive ? (
												<p>Drop files here ...</p>
											) : (
												<div className="flex flex-col items-center gap-3">
													<HiOutlineCloudUpload className="w-8 h-8" />
													<p className="text-primary">Click to upload any documents or images from site visit or any other or drag and drop them</p>
													<em className="text-sm">(Accepting Documents or Images and of less than 50MB )</em>
												</div>
											)}
										</div>
										<div className="mt-2 space-y-2">
											{filesUploadProgress?.map((uploadProgress) => (
												<div key={uploadProgress.id} className="flex items-center gap-2 px-2 py-3 border rounded-xl">
													<CircularProgress aria-label="Uploading..." size="lg" value={uploadProgress?.progress} color="warning" showValueLabel={true} />
													<div>
														<p className="text-sm font-semibold">
															{uploadProgress?.message} for {uploadProgress.name}
														</p>
														<p className="text-sm">{uploadProgress?.size}</p>
													</div>
												</div>
											))}
										</div>
										<div className="mt-2 flex items-center gap-2 flex-wrap">
											{documentFields?.map((item, idx) => (
												<Chip key={item.id} size="sm" color="primary" variant="bordered" onClose={() => onRemoveDocument(idx, item.uploadId)}>
													{item.name}
												</Chip>
											))}
										</div>
										<Spacer y={5} />
										<AppTextEditor label="Any other feedback" name="anyOtherFeedback" control={control} error={formErrors.anyOtherFeedBack} />
									</CardBody>
									<CardFooter>
										<div className="flex items-center justify-end w-full gap-5">
											<Button type="button" onPress={router.back} color="danger" variant="bordered" endContent={<HiX className="w-5 h-5" />}>
												Cancel
											</Button>
											<Button type="submit" color="primary" endContent={<HiCheck className="w-5 h-5" />} isLoading={loading} isDisabled={loading} >
												Update
											</Button>
										</div>
									</CardFooter>
								</Card>
							</form>
						</FormProvider>
					</div>
					<div className="col-auto md:col-span-4">
						<Card shadow="none" className="bg-transparent border">
							<CardHeader>
								<h1 className="text-green-700 font-bold">Order Details</h1>
							</CardHeader>
							<CardBody>
								<div className="pt-2 space-y-4 pb-4 border-b border-b-saastain-gray">
									<div className="w-full flex items-center justify-between">
										<h3 className="text-gray-500 text-sm font-semibold">Product Name</h3>
										<h3 className="text-gray-800 text-sm font-semibold">{orderDetails?.product?.name}</h3>
									</div>
									<div className="w-full flex items-center justify-between">
										<h3 className="text-gray-500 text-sm font-semibold">No of Order</h3>
										<h3 className="text-gray-800 text-sm font-semibold">{allVariantItems?.length ?? 1}</h3>
									</div>
									<div className="w-full flex items-center justify-between">
										<h3 className="text-gray-500 text-sm font-semibold">Actual Cost</h3>
										<h3 className="text-gray-800 text-sm font-semibold">{formatCurrency(actualCost)}</h3>
									</div>
									<div className="w-full flex items-center justify-between">
										<h3 className="text-gray-500 text-sm font-semibold">Maintenance Cost</h3>
										<h3 className="text-gray-800 text-sm font-semibold">{formatCurrency(maintenanceCost)}</h3>
									</div>
									<div className="w-full flex items-center justify-between">
										<h3 className="text-gray-500 text-sm font-semibold">Installation Cost</h3>
										<h3 className="text-gray-800 text-sm font-semibold">{formatCurrency(installationCost)}</h3>
									</div>
									<div className="w-full flex items-center justify-between">
										<h3 className="text-gray-500 text-sm font-semibold">Total Cost</h3>
										<h3 className="text-gray-800 text-sm font-semibold">{formatCurrency(totalCost)}</h3>
									</div>
									<div className="w-full flex items-center justify-between">
										<h3 className="text-gray-500 text-sm font-semibold">Total Area</h3>
										<h3 className="text-gray-800 text-sm font-semibold">{totalArea ? totalArea : "----"}</h3>
									</div>
								</div>
							</CardBody>
							<CardFooter>
								<div className="flex items-center justify-around w-full">
									<Button type="button" variant="bordered" endContent={<HiOutlineExternalLink className="w-5 h-5" />}>
										Flag Order
									</Button>
									<Button type="button" color="primary" variant="bordered" endContent={<HiOutlineExternalLink className="w-5 h-5" />}>
										More Details
									</Button>
								</div>
							</CardFooter>
						</Card>
					</div>
				</div>
			</div>
		</>
	);
};

export default UpdateQuoteDetailsPage;
