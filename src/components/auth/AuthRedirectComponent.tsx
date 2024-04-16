import useAuthRedirect from "@/hooks/useAuthRedirect";
import { AppEnumRoutes } from "@/types/AppEnumRoutes";
import { useRouter } from "next/router";
import { ReactNode, useEffect } from "react";

interface AuthRedirectComponentProps {
	children: ReactNode | ReactNode[];
}

const AuthRedirectComponent = ({ children }: AuthRedirectComponentProps) => {
	const router = useRouter();
	const canShow = useAuthRedirect();

	useEffect(() => {
		if(!router.isReady){
			return
		}
		const timeout = setTimeout(() => {
			if (!canShow) {
				router.push(AppEnumRoutes.AUTH_LOGIN);
				return;
			}
		}, 500);

		return () => clearTimeout(timeout);
	}, [canShow, router]);
    
	return <>{children}</>;
};

export default AuthRedirectComponent;
