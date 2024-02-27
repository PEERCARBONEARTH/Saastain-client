import { Button } from "@nextui-org/react";
import { Calendar } from "lucide-react";
import { forwardRef } from "react";
import { Control, Controller, FieldError } from "react-hook-form";
import DatePicker from "react-datepicker";

interface AppDateInputProps {
	name?: string;
	label: string;
	value?: Date;
	setValue?: (value: Date) => void;
	onChange?: (value: Date) => void;
	error?: FieldError;
	helperText?: string;
	control?: Control<any>;
	maxDate?: Date;
	isRequired?: boolean;
}

const AppDateInput = ({ name, label, value, setValue, onChange, error, helperText, control, maxDate = new Date(), isRequired = false }: AppDateInputProps) => {
	const CustomDateInputBtn = forwardRef(({ value, onClick }: any, ref) => (
		<Button
			className="text-xs px-2"
			fullWidth
			onClick={onClick}
			// @ts-ignore
			ref={ref}
			variant="bordered"
			startContent={<Calendar />}
			color="secondary">
			{value}
		</Button>
	));

	return control ? (
		<Controller
			control={control}
			name={name}
			render={({ field: { onChange: onControlledChange, value: controlledValue } }) => (
				<div className="flex flex-col">
					<p className="text-sm mb-2">{label}</p>
					<DatePicker
						selected={controlledValue}
						onChange={(date) => {
							onControlledChange(date as Date);
						}}
						maxDate={maxDate}
						customInput={<CustomDateInputBtn />}
						dateFormat="yyyy-MM-dd"
						isClearable
					/>
					{helperText && <p className="text-xs text-gray-500">{helperText}</p>}
					{error && <p className="text-xs text-red-500">{error?.message}</p>}
				</div>
			)}
		/>
	) : (
		<div className="flex flex-col">
			<p className="text-sm mb-2">{label}</p>
			<DatePicker
				selected={value}
				onChange={(val) => {
					setValue && setValue(val as Date);
					onChange && onChange(val as Date);
				}}
				maxDate={maxDate}
				customInput={<CustomDateInputBtn />}
				dateFormat="yyyy-MM-dd"
				isClearable
			/>
			{helperText && <p className="text-xs text-gray-500">{helperText}</p>}
			{error && <p className="text-xs text-red-500">{!value && isRequired ? `${label} is required` : undefined}</p>}
		</div>
	);
};

export default AppDateInput;
