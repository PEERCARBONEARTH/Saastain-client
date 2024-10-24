"use client"
import { IOption } from "@/types/Forms";
import { Autocomplete, AutocompleteItem } from "@nextui-org/react";
import { Control, Controller, FieldError } from "react-hook-form";

interface AppAutoCompleteProps {
	name?: string;
	label?: string;
	value?: string;
	setValue?: (val: string) => void;
	isRequired?: boolean;
	error?: FieldError;
	helperText?: string;
	options: (IOption | string)[];
	control?: Control<any>;
	placeholder?: string;
}

const AppAutoComplete = ({ name, label, value, setValue, isRequired, error, helperText, options, control, placeholder = "Choose ..." }: AppAutoCompleteProps) => {
	const getOptionItem = (item: (typeof options)[0]) => {
		const isValue = typeof item === "string";

		const v = isValue ? item : item?.value;
		const l = isValue ? item : item?.label ?? item?.value;

		return { value: v, label: l };
	};
	return control ? (
		<Controller
			name={name}
			control={control}
			render={({ field: { onChange: onControlledChange, value: controlledValue } }) => (
				<Autocomplete
					label={label}
					variant="bordered"
					size="md"
					description={helperText}
					labelPlacement="outside"
					isInvalid={!!error}
					errorMessage={error?.message}
					placeholder={placeholder}
					selectedKey={controlledValue}
					onSelectionChange={(val) => {
						onControlledChange(val);
					}}
					defaultItems={options as Iterable<IOption>}>
					{(item) => <AutocompleteItem key={getOptionItem(item).value}>{getOptionItem(item).label}</AutocompleteItem>}
				</Autocomplete>
			)}
		/>
	) : (
		<Autocomplete
			label={label}
			variant="bordered"
			description={helperText}
			size="md"
			labelPlacement="outside"
			isInvalid={!value && isRequired}
			errorMessage={!value && isRequired ? `${label} is required` : undefined}
			placeholder={placeholder}
			selectedKey={value}
			onSelectionChange={(val) => {
				setValue && setValue(val as any);
			}}
			defaultItems={options as Iterable<IOption>}>
			{(item) => <AutocompleteItem key={getOptionItem(item).value}>{getOptionItem(item).label}</AutocompleteItem>}
		</Autocomplete>
	);
};

export default AppAutoComplete;
