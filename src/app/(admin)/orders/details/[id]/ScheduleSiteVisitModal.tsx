import AppDatePicker from "@/components/forms/AppDatePicker";
import AppInput from "@/components/forms/AppInput";
import AppMultiSelect from "@/components/forms/AppMultiSelect";
import useDidHydrate from "@/hooks/useDidHydrate";
import useOrderUtils from "@/hooks/useOrderUtils";
import { swrFetcher } from "@/lib/api-client";
import { IApiEndpoint } from "@/types/Api";
import { OrderStage, OrderStatus } from "@/types/Order";
import { zodResolver } from "@hookform/resolvers/zod";
import { getLocalTimeZone, now, today, ZonedDateTime } from "@internationalized/date";
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from "@heroui/react";
import { format } from "date-fns";
import { useSession } from "next-auth/react";
import { useMemo, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import useSWR from "swr";
import { z } from "zod";

const dateSchema = z.custom<ZonedDateTime>(
	(val) => {
		if (val instanceof ZonedDateTime) {
			return true;
		}
		return false;
	},
	{
		message: "Invalid Date",
	}
);

const formSchema = z.object({
	eventDate: dateSchema,
	location: z.string().min(1, "Please add location"),
	peercarbonReps: z
		.array(
			z.object({
				label: z.string(),
				value: z.string(),
			})
		)
		.min(1, "Please select at least one rep"),
});

interface IProps {
	orderId: string;
	mutate?: VoidFunction;
}

const ScheduleSiteVisitModal = ({ orderId, mutate }: IProps) => {
	const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
	const [loading, setLoading] = useState<boolean>(false);

	const { data: session } = useSession();
	const { didHydrate } = useDidHydrate();
	const { saveNewOrderTimeline, saveNewOrderSchedule, updateOrderStatus } = useOrderUtils();

	const account = useMemo(() => {
		if (didHydrate) {
			return session?.user;
		}

		return null;
	}, [session]);

	const formMethods = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			eventDate: now(getLocalTimeZone()) as any,
			location: "",
			peercarbonReps: [],
		},
	});

	const {
		reset,
		handleSubmit,
		formState: { errors: formErrors },
		control,
	} = formMethods;

	const onSubmit = async (data: z.infer<typeof formSchema>) => {
		const info = {
			location: data?.location,
			peercarbonReps: data?.peercarbonReps.map((item) => item.value),
			eventDate: new Date(data?.eventDate.toDate())?.toISOString(),
			orderId,
			addedBy: account?.id,
		};

		setLoading(true);
		try {
			const resp = await saveNewOrderSchedule(info);
			if (resp?.status === "success") {
				toast.success("Schedule saved successfully");
				reset();
				mutate && mutate?.();
				const formatedDate = format(new Date(info.eventDate), "MMM dd, yyyy hh:mm bbb");
				saveNewTimelineInfo(orderId, formatedDate);
				updateOrderStatusToInProgress()
				onClose();
			} else {
				toast.error(resp?.msg ?? "Unable to schedule site visit");
			}
		} catch (err) {
			toast.error("Unable to schedule site visit");
		} finally {
			setLoading(false);
		}
	};

	const saveNewTimelineInfo = async (orderId: string, eventDate: string) => {
		const info = {
			orderId,
			code: OrderStage.RFQ,
			title: "Scheduling a visit",
			description: `Peercarbon has scheduled the site visit to be on ${eventDate}`,
		};
		try {
			await saveNewOrderTimeline(info);
		} catch (err) {}
	};

	const updateOrderStatusToInProgress = async () => {
		try {
			await updateOrderStatus(orderId, OrderStatus.IN_PROGRESS);
		} catch (err) {}
	};

	const { data: adminUsersRaw } = useSWR<{ id: string; name: string; email: string }[]>([IApiEndpoint.GET_ADMIN_USERS_FOR_SELECT], swrFetcher, {
		keepPreviousData: true,
	});

	const adminUsersOpts = useMemo(() => {
		if (adminUsersRaw && adminUsersRaw?.length > 0) {
			return adminUsersRaw?.map((item) => {
				return {
					label: item?.name,
					value: item?.id,
				};
			});
		}

		return [];
	}, [adminUsersRaw]);

	return (
		<>
			<Button className="bg-green-700 text-white" onPress={onOpen}>
				Schedule Site Visit
			</Button>
			<Modal isOpen={isOpen} onOpenChange={onOpenChange}>
				<ModalContent className="saastain font-nunito">
					{(onClose) => (
						<FormProvider {...formMethods}>
							<form onSubmit={handleSubmit(onSubmit)}>
								<ModalHeader className="flex flex-col gap-1">
									<h2 className="text-lg font-semibold">Schedule Site Visit</h2>
								</ModalHeader>
								<ModalBody>
									<AppDatePicker label="Event Date" minDate={today(getLocalTimeZone())} name="eventDate" control={control} error={formErrors?.eventDate} />
									<AppInput label={"Location"} placeholder="e.g. Jamhuri High School" name="location" control={control} error={formErrors?.location} />
									<AppMultiSelect label="Peercarbon Rep" options={adminUsersOpts} placeholder="Choose one or more" name="peercarbonReps" control={control} error={formErrors?.peercarbonReps as any} />
								</ModalBody>
								<ModalFooter>
									<Button size="sm" type="button" color="danger" variant="flat" onPress={onClose}>
										Close
									</Button>
									<Button size="sm" type="submit" color="primary" isLoading={loading} isDisabled={loading}>
										Save
									</Button>
								</ModalFooter>
							</form>
						</FormProvider>
					)}
				</ModalContent>
			</Modal>
		</>
	);
};

export default ScheduleSiteVisitModal;
