"use client";
import { FC, ReactNode } from "react";
import { SessionProvider } from "next-auth/react";
import { HeroUIProvider } from "@heroui/react";
import RootLayout from "@/layouts/RootLayout";
import { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";

interface AppProvidersProps {
	children: ReactNode;
}

const AppProviders: FC<AppProvidersProps> = ({ children }) => {
	const router = useRouter();
	return (
		<SessionProvider>
			<HeroUIProvider navigate={router.push}>
				<RootLayout>
					{children}
					<Toaster
						toastOptions={{
							duration: 5000,
							style: {
								background: "#363636",
								color: "#fff",
							},
							className: "text-xs md:text-sm ",
							success: {
								duration: 5000,
								icon: "🎉",
							},
							error: {
								duration: 3000,
								icon: "👎",
							},
						}}
					/>
				</RootLayout>
			</HeroUIProvider>
		</SessionProvider>
	);
};

export default AppProviders;
