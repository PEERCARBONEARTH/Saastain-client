import { useCallback } from "react";
import { useApi } from "./useApi";
import { IEmailTemplate } from "@/types/Template";
import { IApiEndpoint, IApiResponse } from "@/types/Api";

type TSaveEmailTemplate = Pick<IEmailTemplate, "content" | "description" | "subject" | "tags" | "title">;

type TSendEmailInviteData = {
	email: string;
	content: string;
	subject: string;
};

type TUpdateEmailTemplate = TSaveEmailTemplate & {
	templateId: string;
};

const useTemplateUtils = () => {
	const { post, put, del } = useApi();

	const saveNewEmailTemplate = useCallback(
		async (data: TSaveEmailTemplate) => {
			const resp = await post<IApiResponse<IEmailTemplate>>({ endpoint: IApiEndpoint.SAVE_NEW_EMAIL_TEMPLATES, data });
			return resp.data;
		},
		[post]
	);

	const sendEmailInvite = useCallback(
		async (data: TSendEmailInviteData) => {
			const resp = await post<IApiResponse>({ endpoint: IApiEndpoint.SEND_EMAIL_INVITE, data });

			return resp.data;
		},
		[post]
	);

	const updateEmailTemplate = useCallback(
		async (data: TUpdateEmailTemplate) => {
			const resp = await put<IApiResponse>({ endpoint: IApiEndpoint.UPDATE_EMAIL_TEMPLATE, data });

			return resp.data;
		},
		[put]
	);

	const softRemoveEmailTemplate = useCallback(
		async (templateId: string) => {
			const resp = await del<IApiResponse>({ endpoint: `${IApiEndpoint.SOFT_REMOVE_EMAIL_TEMPLATE}/${templateId}` as IApiEndpoint });
			return resp.data;
		},
		[del]
	);

	return { saveNewEmailTemplate, sendEmailInvite, updateEmailTemplate, softRemoveEmailTemplate };
};

export default useTemplateUtils;
