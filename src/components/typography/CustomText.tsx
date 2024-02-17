import { cn } from "@nextui-org/react";
import { HTMLAttributes } from "react";

interface ITextProps extends HTMLAttributes<HTMLDivElement> {}

const CustomText = ({ className, children, ...rest }: ITextProps) => {
	return (
		<div className={cn("text-[12px]", className)} {...rest}>
			{children}
		</div>
	);
};

export default CustomText;
