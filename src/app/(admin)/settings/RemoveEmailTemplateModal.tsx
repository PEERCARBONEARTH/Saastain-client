import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import useTemplateUtils from "@/hooks/useTemplateUtils";
import { IEmailTemplate } from "@/types/Template";
import { Button, useDisclosure } from "@nextui-org/react";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

interface IProps {
	selectedTemplate: IEmailTemplate;
	mutate?: VoidFunction;
}

const RemoveEmailTemplateModal = ({ selectedTemplate, mutate }: IProps) => {
	const { isOpen, onOpenChange, onClose } = useDisclosure();
	const [loading, setLoading] = useState<boolean>(false);

	const { softRemoveEmailTemplate } = useTemplateUtils();

	const onConfirm = async () => {
		setLoading(true);
		try {
			const resp = await softRemoveEmailTemplate(selectedTemplate.id);

			if (resp?.status === "success") {
				toast.success("Email template removed successfully.");
				mutate && mutate?.();
				onClose();
			} else {
				toast.error("Unable to remove the email template at the moment");
			}
		} catch (err) {
			toast.error("Unable to remove the email template at the moment");
		} finally {
			setLoading(false);
		}
	};
	return (
		<AlertDialog open={isOpen} onOpenChange={onOpenChange}>
			<AlertDialogTrigger asChild>
				<Button isIconOnly color="danger" variant="light">
					<Trash2 className="w-5 h-5" />
				</Button>
			</AlertDialogTrigger>
			<AlertDialogContent className="saastain font-nunito">
				<AlertDialogHeader>
					<AlertDialogTitle>
						Are you absolutely sure you want to remove <span className="font-semibold">{selectedTemplate?.title}</span> email template?
					</AlertDialogTitle>
					<AlertDialogDescription>This action cannot be undone. This will remove the template permanently.</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel asChild>
						<Button color="warning" size="sm" variant="flat">
							Cancel
						</Button>
					</AlertDialogCancel>
					<AlertDialogAction asChild>
						<Button isLoading={loading} isDisabled={loading} onPress={onConfirm} color="primary" size="sm">
							Remove
						</Button>
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
};

export default RemoveEmailTemplateModal;
