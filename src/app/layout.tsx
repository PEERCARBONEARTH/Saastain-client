import "@/styles/globals.css";
import AppProviders from "@/providers/AppProviders";
import { Metadata } from "next";
import { FC, ReactNode } from "react";
import { nunito } from "@/lib/font";

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

const AppLayout: FC<Readonly<AppLayoutProps>> = ({ children }) => {
	return (
		<html lang="en" suppressHydrationWarning>
			<head />
			<body className={nunito.className} suppressHydrationWarning>
				<AppProviders>{children}</AppProviders>
			</body>
		</html>
	);
};

export default AppLayout;
