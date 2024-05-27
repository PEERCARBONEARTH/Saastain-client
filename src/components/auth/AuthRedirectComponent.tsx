"use client";
import useAuthRedirect from "@/hooks/useAuthRedirect";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";

interface AuthRedirectComponentProps {
	children: ReactNode | ReactNode[];
}

const AuthRedirectComponent = ({ children }: AuthRedirectComponentProps) => {
	const router = useRouter();
	const pathname = usePathname();
	const { canShow, redirect: redirectPath } = useAuthRedirect();

	useEffect(() => {
		if (!pathname) return;

		const timeout = setTimeout(() => {
			if (!canShow) {
				router.push(redirectPath);
				return;
			}
		}, 500);

		return () => clearTimeout(timeout);
	}, [canShow, router, pathname]);

	return <>{children}</>;
};

export default AuthRedirectComponent;
