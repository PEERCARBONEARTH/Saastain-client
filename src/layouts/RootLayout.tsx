import { cn } from "@nextui-org/react";
import { Nunito } from "next/font/google";
import { FC, ReactNode } from "react";

const nunito = Nunito({
	subsets: ["latin"],
	weight: ["200", "300", "400", "600", "700", "800", "900"],
	variable: "--font-nunito",
});

interface RootLayoutProps {
	children: ReactNode;
}

const RootLayout: FC<Readonly<RootLayoutProps>> = ({ children }) => {
	return <div className={cn("min-h-screen bg-gray-100 font-nunito antialiased", "transition-colors duration-200 ease-in-out", nunito.variable)}>{children}</div>;
};

export default RootLayout;
