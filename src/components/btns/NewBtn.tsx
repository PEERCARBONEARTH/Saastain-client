import { Button } from "@nextui-org/react";
import { ReactNode } from "react";
import { MdAdd } from "react-icons/md";

interface IProps {
	isDisabled?: boolean;
	text: string;
	onClick: VoidFunction;
	icon?: ReactNode;
}

const NewBtn = ({ text, isDisabled, onClick, icon = <MdAdd className="w-5 h-5 text-white" /> }: IProps) => {
	return (
		<Button aria-label="Add" startContent={icon} onClick={onClick} disabled={isDisabled} size="sm" color="primary" >
			<p className="text-sm text-white">{text}</p>
		</Button>
	);
};

export default NewBtn;
