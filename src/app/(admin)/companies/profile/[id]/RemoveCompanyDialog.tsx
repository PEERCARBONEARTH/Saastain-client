import { Button, useDisclosure } from "@nextui-org/react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { FC, useState } from "react";
import useCompanyUtils from "@/hooks/useCompanyUtils";
import toast from "react-hot-toast";
import { FaTrash } from "react-icons/fa";

interface IProps {
	companyId: string;
	companyName: string;
	mutate?: VoidFunction;
}

const RemoveCompanyDialog: FC<IProps> = ({ companyId, companyName, mutate }) => {
	const { isOpen, onClose, onOpenChange } = useDisclosure();
	const [loading, setLoading] = useState<boolean>(false);

	const { updateCompanyAsDeleted } = useCompanyUtils();

	const onConfirm = async () => {
		setLoading(true);

		try {
			const resp = await updateCompanyAsDeleted(companyId);

			if (resp?.status === "success") {
				toast.success("Company removed successfully.");
                mutate && mutate?.()
				onClose();
			} else {
				toast.error(resp?.msg ?? "Unable to remove the company from SaaStain");
			}
		} catch (err) {
			toast.error(err?.response?.data?.msg ?? "Unable to remove the company from SaaStain");
		} finally {
			setLoading(false)
		}
	};
	return (
		<AlertDialog open={isOpen} onOpenChange={onOpenChange}>
			<AlertDialogTrigger asChild>
				<Button color="danger" endContent={<FaTrash />}>
					Delete
				</Button>
			</AlertDialogTrigger>
			<AlertDialogContent className="saastain font-nunito">
				<AlertDialogHeader>
					<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
					<AlertDialogDescription>
						This will remove <span className="font-semibold">{companyName}</span> temporary from SaaStain and the users will not be able to access SaaStain until activated back.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel asChild>
						<Button color="danger" size="sm" variant="flat">
							Cancel
						</Button>
					</AlertDialogCancel>
					<AlertDialogAction asChild>
						<Button size="sm" color="primary" onPress={onConfirm} isLoading={loading} isDisabled={loading}>
							Confirm
						</Button>
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
};

export default RemoveCompanyDialog;
