import React from "react";
import Image from "next/image";
import { FC, ReactNode } from "react";
import saastainLogo from "../../public/images/saastain_logo.svg";
import AuthBackground from "../../public/images/auth-background.svg";


interface AuthLayoutProps {
	children: ReactNode;
}

const AuthLayout: FC<Readonly<AuthLayoutProps>> = ({ children }) => {
	return (
		<div className="bg-auth h-full grid md:grid-cols-2 grid-cols-1 mt-24 md:mt-0 my-auto">
			<div className="container mx-2 md:mx-4 px-4 md:px-8 mt-5  hidden md:flex  flex-col justify-center ">
				<Image className="w-1/4 my-5" src={saastainLogo} alt="" />
				<p className="text-gray-700 text-base">Saastain goes beyond conventional solutions, empowering you to not only navigate the complexities of emissions tracking but also to drive sustainable growth.</p>
			</div>

			{/* Form Content */}
			<div className="container  w-full px-4 my-auto border-l-0 border-gray-200 md:border-l-2 h-full flex flex-col justify-center">
				<Image className="w-1/4 my-2 inline-block md:hidden" src={saastainLogo} alt="" />
				{children}
			</div>
		</div>
	);
};

export default AuthLayout;
