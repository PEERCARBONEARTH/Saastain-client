import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import useCompanyUtils from "@/hooks/useCompanyUtils";
import { CompanyStatus } from "@/types/Company";
import { Button, useDisclosure } from "@nextui-org/react";
import { FC, useState } from "react";
import toast from "react-hot-toast";

interface IProps {
	companyId: string;
	companyName: string;
	mutate?: VoidFunction;
}

const ActivateCompanyDialog: FC<IProps> = ({ companyId, companyName, mutate }) => {
	const { isOpen, onClose, onOpenChange } = useDisclosure();
	const [loading, setLoading] = useState<boolean>(false);

	const { updateCompanyStatus } = useCompanyUtils();

	const onConfirm = async () => {
		setLoading(true);

		try {
			const resp = await updateCompanyStatus(companyId, CompanyStatus.ACTIVE);

			if (resp?.status === "success") {
				toast.success("Company activated successfully.");
				mutate && mutate?.();
				onClose();
			} else {
				toast.error(resp?.msg ?? "Unable to activate the company on SaaStain");
			}
		} catch (err) {
			toast.error(err?.response?.data?.msg ?? "Unable to activate the company from SaaStain");
		}
	};

	return (
		<AlertDialog open={isOpen} onOpenChange={onOpenChange}>
			<AlertDialogTrigger asChild>
				<Button size="sm" color="primary">Activate</Button>
			</AlertDialogTrigger>
			<AlertDialogContent className="saastain font-nunito">
				<AlertDialogHeader>
					<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
					<AlertDialogDescription>
						This will activate <span className="font-semibold">{companyName}</span> and the users will be able to access SaaStain Platform.
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

export default ActivateCompanyDialog;
