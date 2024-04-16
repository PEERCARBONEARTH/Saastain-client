import { FC, ReactNode } from "react";
import { SessionProvider } from "next-auth/react";
import { useRouter } from "next/router";
import { NextUIProvider } from "@nextui-org/react";
import RootLayout from "@/layouts/RootLayout";
import { Toaster } from "react-hot-toast";
import AppServices from "./AppServices";

interface AppProvidersProps {
	children: ReactNode;
	session?: any;
}

const AppProviders: FC<AppProvidersProps> = ({ children, session }) => {
	const router = useRouter();
	return (
		<SessionProvider session={session}>
			<NextUIProvider navigate={router.push}>
				<RootLayout>
					{children}
					<AppServices />
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
			</NextUIProvider>
		</SessionProvider>
	);
};

export default AppProviders;
