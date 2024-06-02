import { FC, ReactNode } from "react";
import Image from "next/image";

interface IProps {
	children: ReactNode | ReactNode[];
}

const AcceptInviteCompanyUserWrapper: FC<IProps> = ({ children }) => {
	return (
		<div className="bg-auth h-screen grid md:grid-cols-2 grid-cols-1 mt-24 md:mt-0 my-auto">
			<div className="container mx-2 md:mx-4 px-4 md:px-8 mt-5  hidden md:flex  flex-col justify-center ">
				<Image className="w-1/4 my-5" src={"/images/saastain_logo.svg"} alt="" width={100} height={100} />
				<p className="text-gray-700 text-base">Saastain goes beyond conventional solutions, empowering you to not only navigate the complexities of emissions tracking but also to drive sustainable growth.</p>
			</div>
			{/* Form Content */}
			<div className="container  w-full px-4 my-auto border-l-0 border-gray-200 md:border-l-2 h-full flex flex-col justify-center">
				<Image className="w-1/4 my-2 inline-block md:hidden" src={"/images/saastain_logo.svg"} width={100} height={100} alt="" />
				{children}
			</div>
		</div>
	);
};

export default AcceptInviteCompanyUserWrapper;
