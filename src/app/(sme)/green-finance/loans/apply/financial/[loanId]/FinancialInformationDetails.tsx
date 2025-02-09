"use client";
import AppInput from "@/components/forms/AppInput";
import { swrFetcher } from "@/lib/api-client";
import { firebaseStorage } from "@/lib/firebase";
import { getFileSize } from "@/lib/utils";
import { IApiEndpoint } from "@/types/Api";
import { AppEnumRoutes } from "@/types/AppEnumRoutes";
import { ILoanApplication } from "@/types/Loan";
import { zodResolver } from "@hookform/resolvers/zod";
import { BreadcrumbItem, Breadcrumbs, Button, Card, CardBody, Chip, CircularProgress, Progress, Spacer } from "@heroui/react";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { nanoid } from "nanoid";
import { FC, useEffect, useState } from "react";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";
import useSWR from "swr";
import { z } from "zod";
import UploadDocumentModal from "./UploadDocumentModal";
import useLoanUtils from "@/hooks/useLoanUtils";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

interface IProps {
	loanId: string;
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
	name: z.string(),
	docType: z.string(),
	blurUrl: z.string(),
	docName: z.string(),
});

const formSchema = z.object({
	totalRevenue: z.string().min(1, "Total Revenue is required"),
	totalAssets: z.string().min(1, "Total Assets is required"),
	totalLiabilities: z.string().min(1, "Total Liabilities is required"),
	yearsOfAuditedFinancialStatements: z.string().min(1, "Years of financial statements is required"),
	yearsOfOperatingTrackRecord: z.string().min(1, "Years of Operating Track Record is required"),
	financialDocuments: z.array(documentsSchema).min(1, "Upload at least one financial document"),
});

const FinancialInformationDetails: FC<IProps> = ({ loanId }) => {
	const [loading, setLoading] = useState<boolean>(false);
	const [filesUploadProgress, setFilesUploadProgress] = useState<IFileUploadProgress[]>([]);
	const [myUploadedFiles, setMyUploadedFiles] = useState<{ name: string; url: string; uploadId: string; blurDocumentUrl: string }[]>([]);

	const { data: loanInfo, isLoading } = useSWR<ILoanApplication>(!loanId ? null : [IApiEndpoint.GET_LOAN_APPLICATION_DETAILS, { id: loanId }], swrFetcher, { keepPreviousData: true });
	const { updateLoanInfo } = useLoanUtils();
	const router = useRouter();

	const formMethods = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			totalRevenue: "",
			totalAssets: "",
			totalLiabilities: "",
			yearsOfAuditedFinancialStatements: "",
			yearsOfOperatingTrackRecord: "",
			financialDocuments: [],
		},
	});

	const {
		handleSubmit,
		reset,
		formState: { errors: formErrors },
		control,
		setValue,
	} = formMethods;

	const { fields, append, remove } = useFieldArray({
		name: "financialDocuments",
		control,
	});

	const onSubmit = async (data: z.infer<typeof formSchema>) => {
		const documents = data.financialDocuments;
		const docCreationDate = new Date().toISOString();
		const docsToSave = documents.map((item) => {
			return {
				documentUrl: item.url,
				documentName: item.docName,
				documentType: item.docType,
				createdAt: docCreationDate,
				updatedAt: docCreationDate,
			};
		});
		const info = {
			totalRevenue: data.totalRevenue,
			totalAssets: data.totalAssets,
			totalLiabilities: data.totalLiabilities,
			yearsOfAuditedFinancialStatements: data.yearsOfAuditedFinancialStatements,
			yearsOfOperatingTrackRecord: data.yearsOfOperatingTrackRecord,
			loanApplicationId: loanId,
			financialDocuments: docsToSave,
		};

		setLoading(true);

		try {
			const resp = await updateLoanInfo(info);

			if (resp.status === "success") {
				toast.success("Financial Information Updated Successfully");
				reset();
				router.push(`${AppEnumRoutes.APP_LOAN_REQUESTS_APPLY_NEW_COMPANY_REVIEW}/${loanId}`);
			} else {
				toast.error(resp?.msg ?? "Unable to update financial information.");
			}
		} catch (err) {
			toast.error("Unable to update financial information.");
		} finally {
			setLoading(false);
		}
	};

	const updateFileUploadProgress = (id: string, progress: number, message: string) => {
		setFilesUploadProgress((prev) => prev.map((file) => (file.id === id ? { ...file, progress, message } : file)));
	};

	const onRemoveDocument = (fieldIdx: number, uploadId: string) => {
		remove(fieldIdx);
		const newUploadProgressArr = filesUploadProgress.filter((item) => item.id !== uploadId);
		setFilesUploadProgress(newUploadProgressArr);
	};

	const uploaderFn = (documentName: string, selectedDocument: File) => {
		const fileNameWithoutExt = selectedDocument.name.split(".").slice(0, -1).join(".");
		const fileExt = selectedDocument.name.split(".").pop();
		const unique_file_name = `${fileNameWithoutExt}_${nanoid(6)}_.${fileExt}`;

		const storageRef = ref(firebaseStorage, `loan-application/documents/${loanId}/${unique_file_name}`);

		const uploadTask = uploadBytesResumable(storageRef, selectedDocument);

		const uploadId = nanoid(10);

		setFilesUploadProgress((prev) => [
			...prev,
			{
				name: selectedDocument.name,
				size: getFileSize(selectedDocument.size),
				message: "Uploading in progress",
				progress: 0,
				id: uploadId,
			},
		]);

		const blurDocumentDataUrl = URL.createObjectURL(selectedDocument);

		append({ uploadId: uploadId, url: blurDocumentDataUrl, blurUrl: blurDocumentDataUrl, name: selectedDocument.name, docType: selectedDocument.type, docName: documentName });

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
			},
			() => {
				getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
					updateFileUploadProgress(uploadId, 100, "Upload complete");
					let info = { name: selectedDocument.name, url: downloadUrl, uploadId, blurDocumentUrl: blurDocumentDataUrl };
					setMyUploadedFiles([info]);
				});
			}
		);
	};

	const updateDocumentUrl = () => {
		const uploadedFiles = [...myUploadedFiles];
		uploadedFiles.forEach((item) => {
			const idx = fields.findIndex((field) => field.uploadId === item.uploadId);
			setValue(`financialDocuments.${idx}.url`, item.url);
		});
		setMyUploadedFiles([]);
	};

	useEffect(() => {
		if (myUploadedFiles && myUploadedFiles?.length > 0) {
			updateDocumentUrl();
		}
	}, [myUploadedFiles]);

	return (
		<>
			<Breadcrumbs>
				<BreadcrumbItem href={AppEnumRoutes.APP_DASHBOARD}>Home</BreadcrumbItem>
				<BreadcrumbItem href={`${AppEnumRoutes.APP_PROJECT_DETAILS}/${loanInfo?.order?.id}`}>{isLoading ? "Loading" : `#${loanInfo?.order?.orderCode} (${loanInfo?.order?.product?.name})`}</BreadcrumbItem>
				<BreadcrumbItem>Loan Application - Finacial Information</BreadcrumbItem>
			</Breadcrumbs>
			<div className="mt-6">
				<h1 className="text-2xl font-bold">PeerCarbon Green Financing Application</h1>
				<div className="mt-4">
					<p className="text-sm">
						To ensure a seamless evaluation and optimize your chances of approval, please provide complete and accurate information in all fields. Rest assured, your application and data are handled with the
						strictest confidentiality in accordance with our privacy policy.
					</p>
					<p className="mt-3 text-sm"> Completing all sections allows us to make a swift and well-informed decision on your request.</p>
				</div>
			</div>
			<Spacer y={6} />
			<Card className="bg-[#E4FCE6]">
				<CardBody>
					<div className="p-8">
						<Progress size="sm" aria-label="Progress..." value={75} className="w-full" maxValue={100} showValueLabel={true} />
						<h1 className="mt-3 font-bold text-xl">Financial Information</h1>
						<FormProvider {...formMethods}>
							<form onSubmit={handleSubmit(onSubmit)}>
								<div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-6">
									<AppInput label={"Revenue for the last 4 quarters"} placeholder="$ 0" name="totalRevenue" control={control} error={formErrors.totalRevenue} />
									<AppInput label={"Total Liabilities as reported in the most recent period"} placeholder="$ 0" name="totalAssets" control={control} error={formErrors.totalAssets} />
									<AppInput label={"Total Assets as reported in the most recent period"} placeholder="$ 0" name="totalLiabilities" control={control} error={formErrors.totalLiabilities} />
									<AppInput
										label={"How many years of Audited Financial Statements do you have available?"}
										placeholder="e.g. 2 years"
										name="yearsOfAuditedFinancialStatements"
										control={control}
										error={formErrors.yearsOfAuditedFinancialStatements}
									/>
									<AppInput
										label={"How many years of Operating Track Record do you have?"}
										placeholder="e.g. 2 years"
										name="yearsOfOperatingTrackRecord"
										control={control}
										error={formErrors.yearsOfOperatingTrackRecord}
									/>
								</div>
								<Spacer y={2} />
								<div className="grid grid-cols-2 mt-4">
									<UploadDocumentModal uploaderFn={uploaderFn} />
								</div>
								{formErrors?.financialDocuments && (
									<div className="grid grid-cols-2 mt-2">
										<div className="px-2 py-3 border border-gray-400 border-dashed rounded-xl">
											<p className="text-sm text-danger text-center">{formErrors?.financialDocuments?.message}</p>
										</div>
									</div>
								)}
								<div className="mt-2 space-y-2">
									<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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
								</div>
								<div className="mt-2 flex items-center gap-2 flex-wrap">
									{fields?.map((item, idx) => (
										<Chip key={item.id} size="sm" color="primary" variant="bordered" onClose={() => onRemoveDocument(idx, item.uploadId)}>
											{item.name}
										</Chip>
									))}
								</div>
								<div className="mt-4 flex items-center justify-end gap-5">
									<Button type="button" startContent={<ChevronLeft size={15} />} color="primary" variant="bordered">
										Previous
									</Button>
									<Button isLoading={loading} isDisabled={loading} type="submit" color="primary" endContent={<ChevronRight size={15} />}>
										Next
									</Button>
								</div>
							</form>
						</FormProvider>
					</div>
				</CardBody>
			</Card>
		</>
	);
};

export default FinancialInformationDetails;
