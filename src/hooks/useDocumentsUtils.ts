import { useCallback } from "react";
import { getEndpoint, IApiEndpoint, IApiResponse } from "@/types/Api";
import axios from "axios";
import { API_URL } from "@/env";

interface OneDocumentUploadType {
	folder: string;
	file: File | Blob;
}

const useDocumentsUtils = () => {
	const uploadOneDocument = useCallback(async (data: OneDocumentUploadType) => {
		const resp = await axios.post<IApiResponse<string>>(`${API_URL}${getEndpoint(IApiEndpoint.UPLOAD_DOCUMENTS_TO_STORAGE_SINGLE)}`, data, {
			headers: {
				"Content-Type": "multipart/form-data",
			},
		});

		return resp.data;
	}, []);

	return { uploadOneDocument };
};

export default useDocumentsUtils;
