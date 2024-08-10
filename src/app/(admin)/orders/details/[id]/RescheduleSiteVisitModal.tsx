import AppDatePicker from "@/components/forms/AppDatePicker";
import AppInput from "@/components/forms/AppInput";
import AppMultiSelect from "@/components/forms/AppMultiSelect";
import useOrderUtils from "@/hooks/useOrderUtils";
import { swrFetcher } from "@/lib/api-client";
import { IApiEndpoint } from "@/types/Api";
import { OrderStage } from "@/types/Order";
import { IOrderSiteVisitSchedule } from "@/types/OrderSiteVisitSchedule";
import { zodResolver } from "@hookform/resolvers/zod";
import { fromDate, getLocalTimeZone, now, today, ZonedDateTime } from "@internationalized/date";
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from "@nextui-org/react";
import { format } from "date-fns";
import { useEffect, useMemo, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import useSWR from "swr";
import { z } from "zod";

interface IProps {
	currentSiteVisitScheduleData: IOrderSiteVisitSchedule | null;
	mutate?: VoidFunction;
    orderId: string
}

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
	peercarbonReps: z.array(
		z.object({
			label: z.string(),
			value: z.string(),
		})
	),
});

const RescheduleSiteVisitModal = ({ currentSiteVisitScheduleData, mutate, orderId }: IProps) => {
	const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();
	const [loading, setLoading] = useState<boolean>(false);

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
		setValue,
	} = formMethods;

	const { saveNewOrderTimeline, rescheduleSiteVisit } = useOrderUtils();


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

	const onSubmit = async (data: z.infer<typeof formSchema>) => {
        const info = {
			location: data?.location,
			peercarbonReps: data?.peercarbonReps.map((item) => item.value),
			eventDate: new Date(data?.eventDate.toDate())?.toISOString(),
		};

		setLoading(true);
		try {
			const resp = await rescheduleSiteVisit(currentSiteVisitScheduleData.id, info);
			if (resp?.status === "success") {
				toast.success("Schedule saved successfully");
				reset();
				mutate && mutate?.();
				const formatedDate = format(new Date(info.eventDate), "MMM dd, yyyy hh:mm bbb");
				saveNewTimelineInfo(orderId, formatedDate);
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
			title: "Site Visit Rescheduled",
			description: `Peercarbon has re-scheduled the site visit to be on ${eventDate}`,
		};
		try {
			await saveNewOrderTimeline(info);
		} catch (err) {}
	};

	const populateFields = () => {
		setValue("location", currentSiteVisitScheduleData?.location);
		setValue("eventDate", fromDate(new Date(currentSiteVisitScheduleData?.eventDate), "Africa/Nairobi"));

		// Use adminUsersRaw to populate peercarbonReps
		const userIds = currentSiteVisitScheduleData?.peercarbonReps || [];
		if (userIds.length > 0) {
			const validUsers =
				adminUsersRaw?.filter(
					(admin) => userIds.some((userId) => userId === admin.id) // Check if admin user ID matches
				) || [];

			setValue(
				"peercarbonReps",
				validUsers.map((user) => ({ label: user.name, value: user.id }))
			);
		}
	};

	useEffect(() => {
		if (isOpen && currentSiteVisitScheduleData) {
			populateFields();
		}
	}, [isOpen, currentSiteVisitScheduleData]);

	return (
		<>
			<Button onPress={onOpen} color="warning">
				Reschedule Site Visit
			</Button>
			<Modal isOpen={isOpen} onOpenChange={onOpenChange}>
				<ModalContent className="saastain font-nunito">
					{(onClose) => (
						<FormProvider {...formMethods}>
							<form onSubmit={handleSubmit(onSubmit)}>
								<ModalHeader className="flex flex-col gap-1">
									<h2 className="text-lg font-semibold">Re-Schedule Site Visit</h2>
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
										Reschedule
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

export default RescheduleSiteVisitModal;
