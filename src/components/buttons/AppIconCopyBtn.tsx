import { Button } from "@nextui-org/react";
import { CheckIcon, CopyIcon } from "lucide-react";
import { MouseEvent, useState } from "react";
import toast from "react-hot-toast";

interface IProps {
	link: string;
	isDisabled?: boolean
}
const AppIconCopyBtn = ({ link, isDisabled = false }: IProps) => {
	const [isCopied, setIsCopied] = useState(false);
	const handleCopy = (e: MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();

		// const appDomain = `${window.location.protocol}//${window.location.hostname}${window.location.port ? `:${window.location.port}` : ""}`;
		navigator.clipboard.writeText(link);
		setIsCopied(true);
		toast.success("Link copied to clipboard");

		setTimeout(() => {
			setIsCopied(false);
		}, 2000);
	};
	return (
		<Button isDisabled={isDisabled} size="sm" color="primary" isIconOnly variant="bordered" onClick={handleCopy}>
			{isCopied ? <CheckIcon size={16} /> : <CopyIcon size={16} />}
		</Button>
	);
};

export default AppIconCopyBtn;
