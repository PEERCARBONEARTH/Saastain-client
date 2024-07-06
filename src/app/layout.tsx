import AppProviders from "@/providers/AppProviders";
import { Metadata } from "next";
import { FC, ReactNode } from "react";

interface AppLayoutProps {
	children: ReactNode | ReactNode[];
}

export const metadata: Metadata = {
	title: {
		default: "SaaStain",
		template: "%s - Vendor SaaStain",
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
			<body suppressHydrationWarning>
				<AppProviders>{children}</AppProviders>
			</body>
		</html>
	);
};

export default AppLayout;
