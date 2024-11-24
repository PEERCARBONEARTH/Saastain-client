"use client";

import AppInput from "@/components/forms/AppInput";
import AppSelect from "@/components/forms/AppSelect";
import useTemplateUtils from "@/hooks/useTemplateUtils";
import { swrFetcher } from "@/lib/api-client";
import { IApiEndpoint } from "@/types/Api";
import { AppEnumRoutes } from "@/types/AppEnumRoutes";
import { IEmailTemplate } from "@/types/Template";
import { removeCurlyBraces } from "@/utils";
import { BreadcrumbItem, Breadcrumbs, Button, Card, CardBody, CardHeader, Spacer, Spinner } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import useSWR from "swr";

type TemplateTagsKeyValue = Record<string, string>;

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(?:\.[a-zA-Z]{2,})?$/;

const generateTagLabel = (tag: string) => {
	const tagWithoutCurry = removeCurlyBraces(tag);
	const formattedTag = tagWithoutCurry.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());

	return formattedTag;
};

const generateContent = (content: string, templateTags: TemplateTagsKeyValue) => {
	if (content) {
		return content.replace(/{([^}]+)}/g, (match, p1) => templateTags[p1] ?? match);
	}
	return content;
};

const InviteCompanyScreen = () => {
	const [selectedTemplate, setSelectedTemplate] = useState<string>("");
	const [tagsInTemplateValue, setTagsInTemplateValue] = useState<TemplateTagsKeyValue>({});
	const [recipientEmail, setRecipientEmail] = useState<string>("");
	const [loading, setLoading] = useState<boolean>(false);

	const router = useRouter();

	const { sendEmailInvite } = useTemplateUtils();

	const { data: loadedTemplates } = useSWR<IEmailTemplate[]>([IApiEndpoint.GET_ALL_EMAIL_TEMPLATES], swrFetcher, { keepPreviousData: true });

	const generatedEmailTemplateOptions = useMemo(() => {
		if (loadedTemplates && loadedTemplates?.length) {
			const options = loadedTemplates?.map((item) => ({ label: `${item.title}: ${item.subject}`, value: item.id }));

			return options;
		}
		return [];
	}, [loadedTemplates]);

	const { data: templateInfo, isLoading: loadingTemplate } = useSWR<IEmailTemplate>(!selectedTemplate ? null : [`${IApiEndpoint.GET_EMAIL_TEMPLATE_INFO}/${selectedTemplate}`], swrFetcher, { keepPreviousData: true });

	const onSubmit = async () => {
		if (!emailRegex.test(recipientEmail)) {
			toast.error("Please enter a valid email address");
			return;
		}

		// check if the template had tags and if so check if the tags have values
		const hasTags = templateInfo?.content?.match(/{.*?}/g);

		if (hasTags) {
			const hasValues = Object.values(tagsInTemplateValue).every((val) => val.trim() !== "") && Object.keys(tagsInTemplateValue).length === (templateInfo?.tags?.length || 0);

			if (!hasValues) {
				toast.error("Please fill in the tags in the template");
				return;
			}
		}

		const body = {
			email: recipientEmail,
			subject: templateInfo.subject,
			content: generateContent(templateInfo?.content, tagsInTemplateValue),
		};

		setLoading(true);

		try {
			const resp = await sendEmailInvite(body);

			if (resp?.status === "success") {
				toast.success("Email sent successfully.");
				setSelectedTemplate("");
				setRecipientEmail("");
				setTagsInTemplateValue({});
				setTimeout(() => {
					router.push("/companies");
				}, 200);
			} else {
				toast.error("Unable to send the email");
			}
		} catch (err) {
			toast.error("Unable to send the email at the moment");
		} finally {
			setLoading(false);
		}
	};

	return (
		<>
			<Breadcrumbs>
				<BreadcrumbItem href={AppEnumRoutes.APP_DASHBOARD}>Home</BreadcrumbItem>
				<BreadcrumbItem>Invite Company</BreadcrumbItem>
			</Breadcrumbs>
			<div className="flex flex-col my-8 space-y-2">
				<h3 className="text-lg font-semibold">Invite</h3>
				<p className="text-gray-600">Lorem ipsum dolor sit amet consectetur adipisicing elit. Velit, labore!</p>
			</div>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
				<Card>
					<CardHeader>Template Information</CardHeader>
					<CardBody>
						<AppSelect
							label="Template"
							options={generatedEmailTemplateOptions}
							value={selectedTemplate}
							setValue={setSelectedTemplate}
							onSelectAction={() => {
								setTagsInTemplateValue({});
							}}
						/>
						{templateInfo && (
							<>
								<Spacer y={3} />
								<AppInput label={"Recipient Email"} placeholder="e.g. john@target.com" value={recipientEmail} setValue={setRecipientEmail} />
								{templateInfo?.tags && templateInfo?.tags?.length && (
									<div className="mt-4">
										{templateInfo?.tags?.map((tag) => (
											<div key={tag}>
												<AppInput
													label={generateTagLabel(tag)}
													placeholder={generateTagLabel(tag)}
													value={tagsInTemplateValue[removeCurlyBraces(tag)]}
													onChange={(e) => setTagsInTemplateValue({ ...tagsInTemplateValue, [removeCurlyBraces(tag)]: e.target.value })}
												/>
												<Spacer y={3} />
											</div>
										))}
									</div>
								)}
								<Spacer y={3} />
								<Button color="primary" isLoading={loading} isDisabled={loading} onPress={onSubmit}>
									Submit
								</Button>
							</>
						)}
					</CardBody>
				</Card>
				<Card>
					<CardHeader>Email Preview</CardHeader>
					<CardBody>
						{loadingTemplate ? (
							<div className="flex items-center justify-center">
								<Spinner size="lg" color="primary" />
							</div>
						) : templateInfo ? (
							<div className="space-y-2">
								<div className="grid grid-cols-6 gap-x-2">
									<h2 className="col-span-1 font-semibold">Title</h2>
									<p className="col-span-5 text-gray-700 text-sm">{templateInfo?.title}</p>
								</div>
								<div className="grid grid-cols-6 gap-x-2">
									<h2 className="col-span-1 font-semibold">Subject</h2>
									<p className="col-span-5 text-gray-700 text-sm">{templateInfo?.subject}</p>
								</div>
								<div className="grid grid-cols-6 gap-x-2">
									<h2 className="col-span-1 font-semibold">Recipient</h2>
									<p className="col-span-5 text-gray-700 text-sm">{recipientEmail}</p>
								</div>
								<div className="grid grid-cols-6 gap-x-2">
									<h2 className="col-span-1 font-semibold">Description</h2>
									<p className="col-span-5 text-gray-700 text-sm">{templateInfo?.description}</p>
								</div>
								<div className="flex items-center gap-x-2">
									<h2 className="font-semibold">Email Content</h2>
								</div>
								<div className="font-nunito mt-2 text-sm" dangerouslySetInnerHTML={{ __html: generateContent(templateInfo?.content, tagsInTemplateValue) }}></div>
							</div>
						) : (
							<p>Please select email template</p>
						)}
					</CardBody>
				</Card>
			</div>
		</>
	);
};

export default InviteCompanyScreen;
