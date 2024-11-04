import { IUser } from "@/types/User";
import { useApi } from "./useApi";
import { useCallback } from "react";
import { IApiEndpoint, IApiResponse } from "@/types/Api";

type TUpdateUserProfileData = Pick<IUser, "name" | "profilePicture" | "roleInCompany" | "phoneNo"> & { userId: string };

type TValidatePasswordData = {
	currentPassword: string;
	userId: string;
};

type TUpdateUserProfilePassword = TValidatePasswordData & {
	newPassword: string;
};

const useUserUtils = () => {
	const { put, post } = useApi();

	const updateUserProfile = useCallback(
		async (data: TUpdateUserProfileData) => {
			const resp = await put<IApiResponse<null>>({ endpoint: IApiEndpoint.UPDATE_USER_PROFILE, data });

			return resp.data;
		},
		[put]
	);

	const validateUserPassword = useCallback(
		async (data: TValidatePasswordData) => {
			const resp = await post<IApiResponse<boolean>>({ endpoint: IApiEndpoint.VALIDATE_CURRENT_PASSWORD, data });

			return resp.data;
		},
		[post]
	);

	const updateUserProfilePassword = useCallback(
		async (data: TUpdateUserProfilePassword) => {
			const resp = await post<IApiResponse<{}>>({ endpoint: IApiEndpoint.UPDATE_USER_PROFILE_PASSWORD, data });

			return resp.data;
		},
		[post]
	);

	return { updateUserProfile, validateUserPassword, updateUserProfilePassword };
};

export default useUserUtils;
