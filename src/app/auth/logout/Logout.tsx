"use client";
import AppSplashView from "@/components/splash/AppSplashView";
import { AppEnumRoutes } from "@/types/AppEnumRoutes";
import { signOut } from "next-auth/react";
import { useEffect } from "react";

const LogoutPage = () => {
	useEffect(() => {
		async function logout() {
			await signOut({ redirect: true, callbackUrl: AppEnumRoutes.AUTH_LOGIN });
		}

		const timeoutRef = setTimeout(() => {
			logout();
		}, 500);

		return () => clearTimeout(timeoutRef);
	}, []);

	return <AppSplashView forceShow />;
};

export default LogoutPage;
