import { useCallback } from "react";
import { useApi } from "./useApi";
import { NewUserFormValues } from "@/types/Forms";
import { IApiEndpoint, IApiResponse } from "@/types/Api";
import { AccountStatus, IUser } from "@/types/User";

const useUserUtils = () => {
	const { post, put } = useApi();
	const createUser = useCallback(async (userData: NewUserFormValues) => {
		const resp = await post<IApiResponse<IUser>>({
			endpoint: IApiEndpoint.CREATE_USER_BY_ADMIN,
			data: userData,
		});

		return resp?.data;
	}, []);

	const suspendUserAccount = useCallback(async (userId: string) => {
		const resp = await post<IApiResponse<null>>({
			endpoint: IApiEndpoint.SUSPEND_ACCOUNT,
			data: { id: userId },
		});

		return resp?.data;
	}, []);

	const activateUserAccount = useCallback(async (userId: string) => {
		const resp = await post<IApiResponse<null>>({
			endpoint: IApiEndpoint.ACTIVATE_ACCOUNT,
			data: { id: userId },
		});

		return resp?.data;
	}, []);

	const markAccountAsDeleted = useCallback(async (userId: string) => {
		const resp = await post<IApiResponse<null>>({
			endpoint: IApiEndpoint.MARK_USER_ACCOUNT_AS_DELETED,
			data: { id: userId },
		});

		return resp?.data;
	}, []);

	const markAccountAsVerified = useCallback(async (userId: string) => {
		const resp = await post<IApiResponse<null>>({
			endpoint: IApiEndpoint.MARK_ACCOUNT_AS_VERIFIED,
			data: { id: userId },
		});

		return resp?.data;
	}, []);

	const updateUserToAdmin = useCallback(async (userId: string) => {
		const resp = await post<IApiResponse<null>>({
			endpoint: IApiEndpoint.UPDATE_USER_TO_ADMIN,
			data: { id: userId },
		});

		return resp?.data;
	}, []);

	const updateUserToSystemAdmin = useCallback(async (userId: string) => {
		const resp = await post<IApiResponse<null>>({
			endpoint: IApiEndpoint.UPDATE_USER_TO_SYSTEM_ADMIN,
			data: { id: userId },
		});

		return resp?.data;
	}, []);

	const requestPasswordReset = useCallback(async (email: string) => {
		const resp = await post<IApiResponse<null>>({ endpoint: IApiEndpoint.REQUEST_PASSWORD_RESET, data: { email, isAdminPasswordReset: true } });

		return resp?.data;
	}, []);

	const verifyPasswordResetToken = useCallback(async (token: string, id: string) => {
		const resp = await post<
			IApiResponse<{
				userId: string;
				email: string;
			}>
		>({ endpoint: IApiEndpoint.VERIFY_PASSWORD_RESET_TOKEN, data: { token, id } });

		return resp?.data;
	}, []);

	const resetPassword = useCallback(async (password: string, token: string, id: string) => {
		const resp = await post<IApiResponse<null>>({ endpoint: IApiEndpoint.RESET_PASSWORD, data: { password, token, id } });

		return resp?.data;
	}, []);

	const updateUserAccountStatus = useCallback(
		async (id: string, status: AccountStatus) => {
			const resp = await put<IApiResponse<null>>({ endpoint: `${IApiEndpoint.UPDATE_ACCOUNT_STATUS}/${id}/${status}` as IApiEndpoint });

			return resp.data;
		},
		[put]
	);

	return {
		createUser,
		suspendUserAccount,
		activateUserAccount,
		markAccountAsDeleted,
		markAccountAsVerified,
		updateUserToAdmin,
		updateUserToSystemAdmin,
		requestPasswordReset,
		verifyPasswordResetToken,
		resetPassword,
		updateUserAccountStatus,
	};
};

export default useUserUtils;
