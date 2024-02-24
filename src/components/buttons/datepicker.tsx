import { Button, Popover, PopoverContent, PopoverTrigger, cn } from "@nextui-org/react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "../ui/calendar";
import { Control, Controller } from "react-hook-form";

interface AppDatePickerProps {
	className?: string;
	name?: string;
	value?: Date;
	setValue?: (value: Date) => void;
	onChange?: (value: Date) => void;
	control?: Control<any>;
}

const AppDatePicker = ({ className, value, setValue, onChange, control, name }: AppDatePickerProps) => {
	return control ? (
		<Controller
			control={control}
			name={name}
			render={({ field: { onChange: onControlledChange, value: changedValue } }) => (
				<Popover>
					<PopoverTrigger>
						<Button variant="bordered" startContent={<CalendarIcon className="h-4 w-4" />} className={cn("w-[240px] justify-start text-left font-normal", !changedValue && "text-muted-foreground", className)}>
							{changedValue ? format(changedValue, "PPP") : <span>Pick a date</span>}
						</Button>
					</PopoverTrigger>
					<PopoverContent className="w-auto p-0">
						<Calendar
							mode="single"
							selected={changedValue}
							onSelect={(val) => {
								onControlledChange(val);
							}}
							initialFocus
						/>
					</PopoverContent>
				</Popover>
			)}
		/>
	) : (
		<Popover>
			<PopoverTrigger>
				<Button variant="bordered" startContent={<CalendarIcon className="h-4 w-4" />} className={cn("w-[240px] justify-start text-left font-normal", !value && "text-muted-foreground", className)}>
					{value ? format(value, "PPP") : <span>Pick a date</span>}
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-auto p-0">
				<Calendar
					mode="single"
					selected={value}
					onSelect={(val) => {
						setValue && setValue(val);
						onChange && onChange(val);
					}}
					initialFocus
				/>
			</PopoverContent>
		</Popover>
	);
};

export default AppDatePicker;
