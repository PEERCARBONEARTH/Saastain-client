import { FC, ReactNode } from "react";

interface AppServicesProps {
	children?: ReactNode;
}

const AppServices: FC<AppServicesProps> = ({ children }) => {
	// TODO: Implement global hooks, context, and services here
	return <>{children}</>;
};

export default AppServices;
