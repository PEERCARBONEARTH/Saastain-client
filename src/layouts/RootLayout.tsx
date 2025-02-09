import { nunito } from "@/lib/font";
import { cn } from "@heroui/react";
import { FC, ReactNode } from "react";

interface RootLayoutProps {
	children: ReactNode;
}

const RootLayout: FC<Readonly<RootLayoutProps>> = ({ children }) => {
	return <div className={cn("saastain min-h-screen bg-gray-100 font-nunito antialiased", "transition-colors duration-200 ease-in-out", nunito.variable)}>{children}</div>;
};

export default RootLayout;
 