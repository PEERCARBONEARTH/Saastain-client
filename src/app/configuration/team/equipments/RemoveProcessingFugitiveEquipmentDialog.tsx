import { Button, useDisclosure } from "@nextui-org/react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import useEquipmentMobilityUtils from "@/hooks/useEquipmentsMobilityUtils";
import toast from "react-hot-toast";

interface IProps {
	equipmentId: string;
	mutate?: VoidFunction;
}

const RemoveProcessingFugitiveEquipmentDialog = ({ equipmentId, mutate }: IProps) => {
	const { isOpen, onOpenChange, onClose } = useDisclosure();
	const [loading, setLoading] = useState<boolean>(false);

	const { removeProcessingEquipment } = useEquipmentMobilityUtils();

	const onConfirm = async () => {
		setLoading(true);
		try {
			const resp = await removeProcessingEquipment(equipmentId);

			if (resp?.status === "success") {
				toast.success("Equipment removed successfully.");
				mutate && mutate?.();
				onClose();
			} else {
				toast.error("Unable to remove the equipment at the moment");
			}
		} catch (err) {
			toast.error("Unable to remove the equipment at the moment");
		} finally {
			setLoading(false);
		}
	};
	return (
		<AlertDialog open={isOpen} onOpenChange={onOpenChange}>
			<AlertDialogTrigger asChild>
				<Button size="sm" color="danger" isIconOnly variant="bordered">
					<Trash2 size={16} />
				</Button>
			</AlertDialogTrigger>
			<AlertDialogContent className="saastain font-nunito">
				<AlertDialogHeader>
					<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
					<AlertDialogDescription>This action cannot be undone. This will remove the equipment permanently.</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel asChild>
						<Button color="danger" size="sm" variant="flat">
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

export default RemoveProcessingFugitiveEquipmentDialog;
