"use client"
import useLoadCompanyConfig from "@/hooks/useLoadCompanyConfig";
import useSessionExpiration from "@/hooks/useSessionExpiration";
import { FC, ReactNode } from "react";

interface AppServicesProps {
	children?: ReactNode;
}

const AppServices: FC<AppServicesProps> = ({ children }) => {
	useSessionExpiration()
	useLoadCompanyConfig()
	return <>{children}</>;
};

export default AppServices;
