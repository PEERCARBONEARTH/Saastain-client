import { AppEnumRoutes } from "@/types/AppEnumRoutes";
import { SystemRole } from "@/types/User";
import { useSession } from "next-auth/react";

type ReturnType = {
	canShow: boolean;
	redirect: AppEnumRoutes;
};

const useAuthRedirect = (): ReturnType => {
	const { data: session, status } = useSession();

	if (status === "loading") return { canShow: false, redirect: AppEnumRoutes.AUTH_LOGIN };

	if (status === "unauthenticated") return { canShow: false, redirect: AppEnumRoutes.AUTH_LOGIN };

	if (session?.user) {
		const account = session?.user;

		const isAdmin = account?.systemRole === SystemRole.SYSTEM_ADMIN || account?.systemRole === SystemRole.ADMIN;

		if (isAdmin) {
			return {
				canShow: true,
				redirect: AppEnumRoutes.APP_DASHBOARD,
			};
		}

		return {
			canShow: false,
			redirect: AppEnumRoutes.AUTH_LOGOUT,
		};
	}

	return {
		canShow: false,
		redirect: AppEnumRoutes.AUTH_LOGIN,
	};
};

export default useAuthRedirect;
