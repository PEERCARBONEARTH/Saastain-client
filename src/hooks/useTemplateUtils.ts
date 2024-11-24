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

const useTemplateUtils = () => {
	const { post } = useApi();

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

	return { saveNewEmailTemplate, sendEmailInvite };
};

export default useTemplateUtils;
