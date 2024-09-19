import { AppEnumRoutes } from "@/types/AppEnumRoutes";
import { signOut, useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import toast from "react-hot-toast";

const useSessionExpiration = () => {
	const { data: session, status } = useSession();
	const router = useRouter();
	const pathname = usePathname()

	const logout = async () => {
		await signOut({
			redirect: false,
		});
		router.push(AppEnumRoutes.AUTH_LOGIN);
	};

	useEffect(() => {
		const checkAuthSession = async () => {
			const isAuthPage = pathname.includes("/auth");
			if (isAuthPage) {
				return;
			}
			if (status === "authenticated" && session) {
				const tokenExpiresAt = new Date(session?.user?.tokenExpiresAt);
				const now = new Date();
				const timeDiff = tokenExpiresAt.getTime() - now.getTime();
				const timeDiffInMinutes = Math.round(timeDiff / 60000);
				if (timeDiffInMinutes <= 0) {
					logout();
					toast.error("Your session has expired. Please login again");
				}

				if (timeDiffInMinutes <= 2) {
					toast.error("Your session is about to expire. Please login again");
				}
			}
		};

		// interval to check session expiration
		const interval = setInterval(() => {
			checkAuthSession();
		}, 1000);

		return () => clearInterval(interval);
	}, [session, status, router]);
};

export default useSessionExpiration;
