import { IUser } from "@/types/User";
import { useApi } from "./useApi";
import { useCallback } from "react";
import { IApiEndpoint, IApiResponse } from "@/types/Api";

type TUpdateUserProfileData = Pick<IUser, "name" | "profilePicture" | "roleInCompany" | "phoneNo"> & { userId: string };

const useUserUtils = () => {
	const { put } = useApi();

	const updateUserProfile = useCallback(
		async (data: TUpdateUserProfileData) => {
			const resp = await put<IApiResponse<null>>({ endpoint: IApiEndpoint.UPDATE_USER_PROFILE, data });

			return resp.data;
		},
		[put]
	);

	return { updateUserProfile };
};

export default useUserUtils;
