import { Button, Link } from "@nextui-org/react";
import { usePathname } from "next/navigation";
import { ReactNode, useMemo } from "react";

interface AppConfigNavLinkItemProps {
	title: string;
	icon?: ReactNode;
	href?: string;
	show?: boolean;
}

const AppConfigNavLinkItem = ({ title, icon, href, show = true }: AppConfigNavLinkItemProps) => {
	const pathname = usePathname();

	const selected = useMemo(() => {
		if (href && pathname !== "/") {
			return pathname === `/configuration/${href}` ? true : false;
		}

		return false;
	}, [href, pathname]);

	return show ? (
		<Button as={Link} href={href ? `/configuration/${href}` : "/configuration"} startContent={icon} color={selected ? "primary" : "default"} variant={selected ? "solid" : "light"}>
			{title}
		</Button>
	) : null;
};

export default AppConfigNavLinkItem;
