import { auth } from "@/lib/auth";
import { AppEnumRoutes } from "@/types/AppEnumRoutes";
import { redirect } from "next/navigation";

export default async function page() {
	const session = await auth();

	if (!session?.user) {
		redirect(AppEnumRoutes.AUTH_LOGIN);
	}

	const account = session?.user;

	if (!account.isOnboardingComplete) {
		redirect(AppEnumRoutes.APP_ONBOARDING_COMPANY);
	}

	redirect(AppEnumRoutes.APP_DASHBOARD);
}
