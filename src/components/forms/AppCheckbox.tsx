import { Checkbox } from "@heroui/react";
import { ReactNode } from "react";
import { Control, Controller, FieldError } from "react-hook-form";

interface AppCheckboxProps {
	label: ReactNode;
	name?: string;
	isSelected?: boolean;
	onValueChange?: (val: boolean) => void;
	control?: Control<any>;
}

const AppCheckbox = ({ label, name, isSelected, onValueChange, control }: AppCheckboxProps) => {
	return control ? (
		<Controller
			name={name}
			control={control}
			render={({ field: { onChange, value } }) => (
				<Checkbox color="primary" isSelected={value} onValueChange={(val) => onChange(val)}>
					{label}
				</Checkbox>
			)}
		/>
	) : (
		<Checkbox
			color="primary"
			isSelected={isSelected}
			onValueChange={(val) => {
				onValueChange && onValueChange(val);
			}}>
			{label}
		</Checkbox>
	);
};

export default AppCheckbox;
