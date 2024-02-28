import { cn } from "@nextui-org/react";
import { ReactNode } from "react";

interface SectionContainerProps {
	title: string;
	children: ReactNode | ReactNode[];
	subtitle?: string;
	otherItems?: ReactNode | ReactNode[];
	className?: string;
	otherItemsClassName?: string;
}

const ProfileSectionContainer = ({ children, title, subtitle, otherItems, className, otherItemsClassName }: SectionContainerProps) => {
	return (
		<div className={cn("py-14 px-4 md:px-0 md:py-2 mx-auto border border-gray-300 rounded-xl mb-5", className)}>
			<div className="w-full xl:w-11/12 grid grid-cols-1 lg:grid-cols-11 gap-4 lg:gap-16 mx-auto px-4 md:px-0">
				<div className="col-span-auto md:col-span-7">
					<div className="flex flex-col gap-2">
						<h3 className="text-[14px] font-semibold">{title}</h3>
						<p className="text-[12px] text-default-500">{subtitle}</p>
					</div>
				</div>
				<div className="col-span-auto lg:col-span-4">{children}</div>
			</div>
			<div className={otherItemsClassName}>{otherItems}</div>
		</div>
	);
};

export default ProfileSectionContainer;
