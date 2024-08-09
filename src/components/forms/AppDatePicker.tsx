import { DateValue, getLocalTimeZone, now } from "@internationalized/date";
import { DatePicker } from "@nextui-org/react";
import { Dispatch, SetStateAction } from "react";
import { Control, Controller, FieldError } from "react-hook-form";

interface IProps {
	name?: string;
	label: string;
	value?: DateValue;
	setValue?: Dispatch<SetStateAction<DateValue>>;
	onChange?: (val: DateValue) => void;
	error?: FieldError;
	control?: Control<any>;
	minDate?: DateValue;
	maxDate?: DateValue;
}

const AppDatePicker = ({ name, label, value, setValue, onChange, error, control, minDate, maxDate }: IProps) => {
	return control ? (
		<Controller
			name={name}
			control={control}
			render={({ field: { onChange: onControlledChange, value: changedValue } }) => (
				<DatePicker
					onChange={onControlledChange}
					value={changedValue}
					classNames={{ popoverContent: "saastain font-nunito" }}
					label={label}
					variant="bordered"
					hideTimeZone
					showMonthAndYearPickers
					defaultValue={now(getLocalTimeZone()) as any}
					isInvalid={!!error}
					errorMessage={error?.message}
					minValue={minDate as any}
					maxValue={maxDate as any}
				/>
			)}
		/>
	) : (
		<DatePicker
			classNames={{ popoverContent: "saastain font-nunito" }}
			label={label}
			variant="bordered"
			hideTimeZone
			showMonthAndYearPickers
			defaultValue={now(getLocalTimeZone()) as any}
			value={value}
			onChange={(val) => {
				onChange && onChange?.(val as any);
				setValue && setValue?.(val as any);
			}}
			minValue={minDate as any}
			maxValue={maxDate as any}
		/>
	);
};

export default AppDatePicker;
