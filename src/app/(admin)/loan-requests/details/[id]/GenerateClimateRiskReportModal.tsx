import AppDatePicker from "@/components/buttons/datepicker";
import AppInput from "@/components/forms/AppInput";
import AppSelect from "@/components/forms/AppSelect";
import { API_URL, CLIMATE_RISK_AI_MODEL_BASE_URL } from "@/env";
import useDocumentsUtils from "@/hooks/useDocumentsUtils";
import useGreenLoanUtils from "@/hooks/useGreenLoanUtils";
import { getEndpoint, IApiEndpoint } from "@/types/Api";
import { IClimateRiskData } from "@/types/ClimateRisk";
import { IGreenLoanApplication } from "@/types/GreenLoanApplication";
import { countiesData, generateOptions } from "@/utils";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Spacer, useDisclosure } from "@nextui-org/react";
import axios from "axios";
import { sub } from "date-fns";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { HiEye } from "react-icons/hi";
import { date, InferType, object, string } from "yup";

const formSchema = object({
	address: string().required("Please enter the address."),
	date: date().required("Please pick a date for assessment"),
	county: string().required("Please choose a county"),
});

type ErrorResp = {
	Error: string;
};

type RespType = IClimateRiskData | ErrorResp;

interface IProps {
	loanApplication: IGreenLoanApplication;
	refetch: VoidFunction;
}

function replaceSpacesWithHyphen(inputString: string) {
	return inputString.replace(/ /g, "-");
}

const GenerateClimateRiskReportModal = ({ loanApplication, refetch }: IProps) => {
	const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
	const [loading, setLoading] = useState<boolean>(false);
	const [loadedData, setLoadedData] = useState<IClimateRiskData>();

	const formMethods = useForm({
		resolver: yupResolver(formSchema),
		defaultValues: {
			address: "",
			date: sub(new Date(), { days: 1 }),
			county: "",
		},
	});

	const {
		handleSubmit,
		formState: { errors: formErrors },
		control,
		reset,
		setValue,
	} = formMethods;

	const { uploadOneDocument } = useDocumentsUtils();
	const { updateClimateRiskDocument } = useGreenLoanUtils();

	const updateClimateRiskDocumentInLoanApplication = async (url: string) => {
		const today = new Date();
		try {
			await updateClimateRiskDocument(loanApplication?.id, {
				riskLevel: loadedData["Climate Risk Category"],
				score: loadedData["Climate Risk Score (Based on CO2 emissions)"],
				documentUrl: url,
				mapUrl: loadedData.Map_SME,
				addedOn: today.toISOString(),
			});
			refetch();
		} catch (err) {
			console.log('err', err)
		}
	};

	const uploadDocumentToStorage = async (documentFile: Blob, documentName: string, folderPath: string, callback: (url: string) => void) => {
		const file = new File([documentFile], documentName, { type: "application/pdf" });
		try {
			const info = {
				file,
				folder: folderPath,
			};
			const resp = await uploadOneDocument(info);
			if (resp?.status === "success") {
				callback(resp?.data);
			}
		} catch (err) {
			console.log(err);
		}
	};

	const generateClimateRiskReportDocument = async (score: number, riskLevel: string, location: string, mapPin: string, smeName: string) => {
		const info = {
			score,
			riskLevel,
			location,
			mapPin,
			smeName,
		};
		try {
			const resp = await axios.post<Blob>(`${API_URL}${getEndpoint(IApiEndpoint.GENERATE_CLIMATE_RISK_REPORT)}`, info, {
				headers: {
					Accept: "application/json",
				},
				responseType: "blob",
			});

			const arrBuffer = await resp.data.arrayBuffer();

			const blob = new Blob([arrBuffer], { type: "application/pdf" });

			let companyRaw = loanApplication?.company?.companyName;
			let companyName = replaceSpacesWithHyphen(companyRaw);

			let documentName = `${companyName}-climate-risk-report.pdf`;
			let folderPath = `climate-risk-reports/${loanApplication?.company?.id}`;

			uploadDocumentToStorage(blob, documentName, folderPath, updateClimateRiskDocumentInLoanApplication);

			const url = window.URL.createObjectURL(blob);

			const link = document.createElement("a");

			link.href = url;

			link.setAttribute("download", documentName);

			document.body.appendChild(link);

			link.click();

			setTimeout(() => window.URL.revokeObjectURL(url), 3000);
		} catch (err) {}
	};

	const onSubmit = async (data: InferType<typeof formSchema>) => {
		setLoading(true);
		const id = toast.loading("Generating Climate Risk Analysis ...");
		const info = {
			...data,
			date: data.date.toISOString().split("T")[0],
		};
		try {
			const resp = await axios.post<RespType>(`/api/ai`, info);
			const rawData = resp.data;

			if ((rawData as any)?.Map_SME) {
				toast.success("Analysis Complete. Preparing the document ...", { id });
				let data = rawData as any;
				reset();
				data = {
					...data,
					Map_SME: String(data.Map_SME).replace("http://0.0.0.0:8080", CLIMATE_RISK_AI_MODEL_BASE_URL),
				};
				setLoadedData(data as any);
				generateClimateRiskReportDocument(data["Climate Risk Score (Based on CO2 emissions)"], data["Climate Risk Category"], info.address, data.Map_SME, loanApplication.company.companyName);
				onClose();
			} else {
				toast.error("Unable to generate climate risk report", { id });
			}
		} catch (err) {
			toast.error("Unable to generate climate risk report", { id });
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		if (isOpen && loanApplication) {
			setValue("address", loanApplication.companyLocation);
		}
	}, [isOpen, loanApplication]);

	return (
		<>
			<Button type={'button'} onPress={onOpen} className="bg-yellow-700 text-white" endContent={<HiEye className="w-5 h-5" />}>
				Generate
			</Button>
			<Modal isOpen={isOpen} onOpenChange={onOpenChange}>
				<ModalContent className="saastain font-nunito">
					{(onClose) => (
						<FormProvider {...formMethods}>
							<form onSubmit={handleSubmit(onSubmit)}>
								<ModalHeader className="flex flex-col gap-1">
									<h2 className="text-lg font-semibold uppercase">Generate Climate Risk Report</h2>
								</ModalHeader>
								<ModalBody>
									<AppInput label={"Location / Address"} name="address" control={control} error={formErrors?.address} placeholder="e.g. Jamhuri Primary School" />
									<div className="space-y-2">
										<p className="text-sm mb-2">Date</p>
										<AppDatePicker name="date" control={control} className="w-full" />
										{formErrors?.date && <p className="text-xs text-danger">{formErrors?.date?.message}</p>}
									</div>
									<AppSelect label="County" placeholder="Select a county" options={generateOptions(countiesData)} name="county" control={control} error={formErrors?.county} />
								</ModalBody>
								<ModalFooter>
									<Button size="sm" type="button" color="danger" variant="flat" onPress={onClose}>
										Cancel
									</Button>
									<Button size="sm" type="submit" color="primary" isDisabled={loading} isLoading={loading}>
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

export default GenerateClimateRiskReportModal;
