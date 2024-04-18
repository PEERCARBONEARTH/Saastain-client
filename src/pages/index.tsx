import AppSplashView from "@/components/splash/AppSplashView";
import { AppEnumRoutes } from "@/types/AppEnumRoutes";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";

const index = () => {
	const { data: session, status } = useSession();
	const router = useRouter();

	useEffect(() => {
		if (!router.isReady) {
			return;
		}

		let redirectPath: AppEnumRoutes = AppEnumRoutes.APP_DASHBOARD;

		if (status === "unauthenticated") {
			router.push(AppEnumRoutes.AUTH_LOGIN);
			return;
		}

		const account = session?.user;

		if (account === undefined) {
			router.push(AppEnumRoutes.AUTH_LOGIN);
		}

		if (!account?.company && account?.isCompanyAdmin) {
			router.push(AppEnumRoutes.CREATE_COMPANY);
		}

		if (!account?.company && !account?.isCompanyAdmin) {
			router.push(AppEnumRoutes.APP_LOBBY);
		}

		const timeoutRef = setTimeout(() => {
			router.push(redirectPath);
		}, 500);

		return () => clearTimeout(timeoutRef);
	}, [router, status, session]);

	return <AppSplashView forceShow />;
};

export default index;
