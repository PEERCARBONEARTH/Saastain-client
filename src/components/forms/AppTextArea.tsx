"use client"
import { Textarea } from "@nextui-org/react";
import { ReactNode } from "react";
import { Control, Controller, FieldError } from "react-hook-form";

interface AppTextAreaProps {
	name?: string;
	label: string;
	value?: string;
	setValue?: (value: string) => void;
	onChange?: (value: string) => void;
	error?: FieldError;
	helperText?: string;
	control?: Control<any>;
	placeholder?: string;
	startContent?: ReactNode;
}

const AppTextArea = ({ name, label, placeholder, value, setValue, onChange, error, helperText, control, startContent }: AppTextAreaProps) => {
	return control ? (
		<Controller
			name={name}
			control={control}
			render={({ field: { onChange: onControlledChange, value: changedValue } }) => (
				<Textarea
					label={label}
					labelPlacement="outside"
					variant="bordered"
					value={changedValue}
					placeholder={placeholder}
					onChange={onControlledChange}
					onValueChange={setValue}
					description={helperText}
					isInvalid={!!error}
					errorMessage={error?.message}
					size="md"
					minRows={3}
					startContent={startContent}
				/>
			)}
		/>
	) : (
		<Textarea
			label={label}
			labelPlacement="outside"
			variant="bordered"
			value={value}
			placeholder={placeholder}
			onValueChange={(val) => {
				setValue && setValue(val);
				onChange && onChange(val);
			}}
			description={helperText}
			isInvalid={!!error}
			errorMessage={error?.message}
			size="md"
			minRows={3}
		/>
	);
};

export default AppTextArea;
