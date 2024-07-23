import Image from "next/image";
import { FC, ReactNode } from "react";

interface AuthLayoutProps {
	children: ReactNode;
}

const AuthLayout: FC<AuthLayoutProps> = ({ children }) => {
	return (
		<div className="bg-auth h-screen grid grid-cols-1 md:grid-cols-9">
			<div className="md:col-span-3 bg-green-50">
				<div className="flex items-center justify-center h-full">
					<Image src={"/images/auth-hero-img.png"} width={400} height={400} alt="Auth Image" />
				</div>
			</div>
			<div className="col-span-full md:col-span-6">
				<div className="container flex flex-col justify-center h-full px-3 md:px-16">{children}</div>
			</div>
		</div>
	);
};

export default AuthLayout;
