import { Button } from "@nextui-org/react";
import { MdOutlineRefresh } from "react-icons/md";

interface IProps {
	isLoading: boolean;
	refetch: Function;
}

const RefreshBtn = ({ isLoading, refetch }: IProps) => {
	return (
		<Button color="primary" aria-label="Refresh" startContent={!isLoading && <MdOutlineRefresh size={16} />} isLoading={isLoading} onClick={() => refetch()} disabled={isLoading} size="sm">
			{isLoading ? "Refreshing..." : "Refresh"}
		</Button>
	);
};

export default RefreshBtn;
