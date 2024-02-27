import { cn } from "@nextui-org/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { ReactNode, useMemo } from "react";

interface AppNavLinkItemProps {
	title: string;
	icon?: ReactNode;
	href?: string;
}

const AppNavLinkItem = ({ title, icon, href }: AppNavLinkItemProps) => {
	const router = useRouter();
	const pathname = router.pathname;

	const selected = useMemo(() => {
		if (href && pathname !== "/") {
			return pathname === `/${href}` ? true : false;
		}

		return false;
	}, [href, pathname]);
	return (
		<Link href={href ? `/${href}` : "/"}>
			<div className="flex flex-col mt-2">
				<div className={cn("text-sm text-gray-700 hover:text-gray-900 flex space-x-3", { "text-primary font-bold": selected })}>
					<div className="mr-1">{icon}</div>
					<span className="text-[14px]">{title}</span>
				</div>
			</div>
		</Link>
	);
};

export default AppNavLinkItem;
