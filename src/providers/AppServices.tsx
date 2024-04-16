import useSessionExpiration from "@/hooks/useSessionExpiration";
import { FC, ReactNode } from "react";

interface AppServicesProps {
	children?: ReactNode;
}

const AppServices: FC<AppServicesProps> = ({ children }) => {
	useSessionExpiration()
	return <>{children}</>;
};

export default AppServices;
