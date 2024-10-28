import "@/styles/globals.css";
import { nunito } from "@/lib/font";
import AppProviders from "@/providers/AppProviders";
import { Metadata } from "next";
import { FC, ReactNode } from "react";

interface AppLayoutProps {
	children: ReactNode | ReactNode[];
}

export const metadata: Metadata = {
	title: {
		default: "SaaStain",
		template: "%s | SaaStain",
	},
	description: "Next-gen SaaS tool that simplifies your carbon accounting",
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
		shortcut: "/favicon.ico"
	},
	metadataBase: new URL("https://carbon.saastain.app"),
	openGraph: {
		title: "SaaStain",
		description: "Next-gen SaaS tool that simplifies your carbon accounting",
		url: "https://carbon.saastain.app",
		siteName: "SaaStain",
		images: [
			{
				url: "https://carbon.saastain.app/favicon.ico",
			},
		],
		locale: "en_US",
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "SaaStain",
		description: "Next-gen SaaS tool that simplifies your carbon accounting",
		creator: "@peercarbon",
		images: ["https://carbon.saastain.app/favicon.ico"]
	}
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
