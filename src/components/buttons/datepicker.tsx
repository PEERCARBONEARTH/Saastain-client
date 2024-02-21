import { Button, Popover, PopoverContent, PopoverTrigger, cn } from "@nextui-org/react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "../ui/calendar";
import { useState } from "react";

interface AppDatePickerProps {
	className?: string;
}

const AppDatePicker = ({ className }: AppDatePickerProps) => {
	const [date, setDate] = useState<Date>();
	return (
		<Popover>
			<PopoverTrigger>
				<Button variant="bordered" startContent={<CalendarIcon className="h-4 w-4" />} className={cn("w-[240px] justify-start text-left font-normal", !date && "text-muted-foreground", className)}>
					{date ? format(date, "PPP") : <span>Pick a date</span>}
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-auto p-0">
				<Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
			</PopoverContent>
		</Popover>
	);
};

export default AppDatePicker;
