"use client";

import { AppEnumRoutes } from "@/types/AppEnumRoutes";
import { signOut } from "next-auth/react";
import { useEffect } from "react";

const LogoutPage = () => {
	useEffect(() => {
		async function logout() {
			await signOut({ redirect: true, callbackUrl: AppEnumRoutes.AUTH_LOGIN });
		}

        logout();
	}, []);
	return <div />;
};

export default LogoutPage;
