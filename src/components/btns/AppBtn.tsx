import { Button, ButtonProps, cn } from "@nextui-org/react";
import { ReactNode } from "react";

interface IProps extends ButtonProps {
	text: string;
	onClick?: VoidFunction;
	startIcon?: ReactNode;
	endIcon?: ReactNode;
	isDisabled?: boolean;
	loadingText?: string;
	className?: string;
}

const AppBtn = ({ text, startIcon, endIcon, onClick, isDisabled, className, ...rest }: IProps) => {
	return (
		<Button
			aria-label="Add"
			color="primary"
			startContent={startIcon ? (rest?.isLoading ? null : startIcon) : null}
			onClick={onClick}
			disabled={isDisabled}
			size="sm"
			endContent={endIcon ? (rest?.isLoading ? null : endIcon) : null}
			className={cn(className)}
			{...rest}>
			{rest?.isLoading ? rest?.loadingText ?? "Submitting" : text}
		</Button>
	);
};

export default AppBtn;
