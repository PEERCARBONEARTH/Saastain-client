import AppProviders from "@/providers/AppProviders";
import { Metadata } from "next";
import { Nunito } from "next/font/google";
import { FC, ReactNode } from "react";

interface AppLayoutProps {
	children: ReactNode | ReactNode[];
}

export const metadata: Metadata = {
	title: {
		default: "SaaStain",
		template: "%s - SaaStain Admin",
	},
	description: "SaaStain",
	keywords: ["Sustainability", "Green Finance", "SaaS", "Climate Tech", "Fintech"],
	authors: [
		{
			name: "Peercarbon",
			url: "https://peercarbon.earth",
		},
	],
	creator: "Peercarbon",
	icons: {
		icon: "/favicon.ico",
	},
};


const nunito = Nunito({
	subsets: ["latin"],
	weight: ["200", "300", "400", "600", "700", "800", "900"],
	variable: "--font-nunito",
});


const AppLayout: FC<Readonly<AppLayoutProps>> = ({ children }) => {
	return (
		<html className={nunito.className} lang="en" suppressHydrationWarning>
			<head />
			<body suppressHydrationWarning>
				<AppProviders>{children}</AppProviders>
			</body>
		</html>
	);
};

export default AppLayout;
