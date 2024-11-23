import { useCallback } from "react";
import { useApi } from "./useApi";
import { IEmailTemplate } from "@/types/Template";
import { IApiEndpoint, IApiResponse } from "@/types/Api";

type TSaveEmailTemplate = Pick<IEmailTemplate, "content" | "description" | "subject" | "tags" | "title">;

const useTemplateUtils = () => {
	const { post } = useApi();

	const saveNewEmailTemplate = useCallback(
		async (data: TSaveEmailTemplate) => {
			const resp = await post<IApiResponse<IEmailTemplate>>({ endpoint: IApiEndpoint.SAVE_NEW_EMAIL_TEMPLATES, data });
			return resp.data;
		},
		[post]
	);

	return { saveNewEmailTemplate };
};

export default useTemplateUtils;
