import { auth } from "@/lib/auth";
import { AppEnumRoutes } from "@/types/AppEnumRoutes";
import { SystemRole } from "@/types/User";
import { redirect } from "next/navigation";

export default async function page() {
	const session = await auth()

	if (!session?.user) {
		redirect(AppEnumRoutes.AUTH_LOGIN);
	}

	const account = session?.user;

	const isAdmin = account?.systemRole === "admin" || account?.systemRole === SystemRole.SYSTEM_ADMIN;

	if (!isAdmin) {
		redirect(AppEnumRoutes.AUTH_LOGOUT);
	}

	redirect(AppEnumRoutes.APP_DASHBOARD);
}
