import { cn } from "@nextui-org/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode, useMemo, cloneElement } from "react";

interface AppNavLinkItemProps {
	title: string;
	icon?: ReactNode;
	href?: string;
	show?: boolean;
}

const AppNavLinkItem = ({ title, icon, href, show = true }: AppNavLinkItemProps) => {
	const pathname = usePathname();

	const selected = useMemo(() => {
		if (href && pathname !== "/") {
			return pathname === `/${href}` ? true : false;
		}

		return false;
	}, [href, pathname]);

	const modifiedIcon = icon && cloneElement(icon as React.ReactElement, {
		className: cn(
			(icon as React.ReactElement).props.className,
			selected ? "text-white" : "text-primary"
		)
	});

	return show ? (
		<Link href={href ? `/${href}` : "/"}> 
			<div  
				className={cn( 
					"flex flex-col mt-2 px-2 py-1 rounded-md transition-colors duration-200", 
					{ 
						"bg-[#5E896E]": selected, 
						"hover:bg-gray-100": !selected 
					} 
				)} 
			> 
				<div className="flex space-x-3 items-center"> 
					<div className="mr-1">{modifiedIcon}</div> 
					<span className={cn("text-[14px]", {
						"text-white": selected,
						"text-gray-700": !selected
					})}>{title}</span> 
				</div> 
			</div> 
		</Link> 
	) : null; 
};

export default AppNavLinkItem;