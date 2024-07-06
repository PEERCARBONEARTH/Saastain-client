import { nextAuthOptions } from "@/lib/next-auth-options";
import { AppEnumRoutes } from "@/types/AppEnumRoutes";
import { SystemRole } from "@/types/User";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function page() {
	const session = await getServerSession(nextAuthOptions);

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
