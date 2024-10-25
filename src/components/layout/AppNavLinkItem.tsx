import { cn } from "@nextui-org/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode, useMemo } from "react";

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
	return show ? (
		<Link href={href ? `/${href}` : "/"}>
			<div className="flex flex-col mt-2">
				<div className={cn("text-sm text-gray-700 hover:text-gray-900 flex space-x-3", { "text-primary font-bold": selected })}>
					<div className="mr-1">{icon}</div>
					<span className="text-[14px]">{title}</span>
				</div>
			</div>
		</Link>
	) : null;
};

export default AppNavLinkItem;
