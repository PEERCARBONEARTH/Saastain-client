import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import useGreenLoanUtils from "@/hooks/useGreenLoanUtils";
import { IGreenLoanApplication } from "@/types/GreenLoanApplication";
import { Button, useDisclosure } from "@heroui/react";
import { CheckIcon } from "lucide-react";
import { FC, useState } from "react";
import toast from "react-hot-toast";

interface IProps {
	loanDetails: IGreenLoanApplication;
    mutate: VoidFunction
}

const ApproveLoanModal: FC<IProps> = ({ loanDetails, mutate }) => {
	const { isOpen, onOpenChange, onClose } = useDisclosure();
	const [loading, setLoading] = useState<boolean>(false);

	const { updateLoanToApprovedTest } = useGreenLoanUtils();

	const onApprove = async () => {
        setLoading(true);

        try {
            const resp = await updateLoanToApprovedTest(loanDetails.id);

            if(resp?.status === "success"){
                toast.success("Loan Approved Successfully")
                mutate()
                onClose()
            } else {
                toast.error(resp?.msg ?? "Unable to appprove the loan request")
            }
        } catch (err) {
            toast.error("Unable to appprove the loan request")
        } finally {
            setLoading(false)
        }
    };

	return (
		<AlertDialog open={isOpen} onOpenChange={onOpenChange}>
			<AlertDialogTrigger asChild>
				<Button color="primary" endContent={<CheckIcon className="w-5 h-5" />}>
					Approve Loan
				</Button>
			</AlertDialogTrigger>
			<AlertDialogContent className="saastain font-nunito">
				<AlertDialogHeader>
					<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
					<AlertDialogDescription>This will approve this loan request.</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel asChild>
						<Button color="danger" size="sm" variant="flat">
							Cancel
						</Button>
					</AlertDialogCancel>
					<AlertDialogAction asChild>
						<Button size="sm" color="primary" onPress={onApprove} isLoading={loading} isDisabled={loading}>
							Approve
						</Button>
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
};

export default ApproveLoanModal;
