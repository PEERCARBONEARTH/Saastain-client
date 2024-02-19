import { useCallback } from "react";
import { Control, Controller, FieldError, FieldErrorsImpl, Merge } from "react-hook-form";
import Select, { ClearIndicatorProps, DropdownIndicatorProps, components } from "react-select";
import makeAnimated from "react-select/animated";
import clsx from "clsx";
import { ChevronDownIcon, XIcon } from "lucide-react";
import { IOption } from "@/types/Forms";

interface AppMultiSelectProps {
	name?: string;
	label: string;
	options: (IOption | string)[];
	value?: string[];
	setValue?: (value: string[]) => void;
	onChange?: (value: string[]) => void;
	error?: FieldError | Merge<FieldError, FieldErrorsImpl<any>> | Merge<FieldError, FieldError[]>;
	helperText?: string;
	control?: Control<any>;
	placeholder?: string;
}

const DropdownIndicator = (props: DropdownIndicatorProps) => {
	return (
		<components.DropdownIndicator {...props}>
			<ChevronDownIcon className="w-5 h-5" />
		</components.DropdownIndicator>
	);
};
const ClearIndicator = (props: ClearIndicatorProps) => {
	return (
		<components.ClearIndicator {...props}>
			<XIcon className="w-5 h-5" />
		</components.ClearIndicator>
	);
};

const animatedComponents = makeAnimated({
	DropdownIndicator,
	ClearIndicator,
});

const controlStyles = {
	base: "border rounded-lg bg-white hover:cursor-pointer",
	focus: "border-purple-600 ring-1 ring-purple-500",
	nonFocus: "border-gray-300 hover:border-gray-400",
};

const placeholderStyles = "text-gray-500 pl-1 py-0.5";
const selectInputStyles = "pl-1 py-0.5";
const valueContainerStyles = "p-1 gap-1";
const singleValueStyles = "leading-7 ml-1";
const multiValueStyles = "bg-gray-100 rounded items-center py-0.5 pl-2 pr-1 gap-1.5";
const multiValueLabelStyles = "leading-6 py-0.5";
const multiValueRemoveStyles = "border border-gray-200 bg-white hover:bg-red-50 hover:text-red-800 text-gray-500 hover:border-red-300 rounded-md";
const indicatorsContainerStyles = "p-1 gap-1";
const clearIndicatorStyles = "text-gray-500 p-1 rounded-md hover:bg-red-50 hover:text-red-800";
const indicatorSeparatorStyles = "bg-gray-300";
const dropdownIndicatorStyles = "p-1 hover:bg-gray-100 text-gray-500 rounded-md hover:text-black";
const menuStyles = "p-1 mt-2 border border-gray-200 bg-white rounded-lg";
const groupHeadingStyles = "ml-3 mt-2 mb-1 text-gray-500 text-sm";
const optionStyles = {
	base: "hover:cursor-pointer px-3 py-2 rounded",
	focus: "bg-gray-100 active:bg-gray-200",
	selected: "after:content-['✔'] after:ml-2 after:text-green-500 text-gray-500",
};
const noOptionsMessageStyles = "text-gray-500 p-2 bg-gray-50 border border-dashed border-gray-200 rounded-sm";
const containerStyles = "bg-white rounded-lg border border-gray-200 z-50";

const AppMultiSelect = ({ name, label, options, value, setValue, onChange, error, helperText, control, placeholder = "Select one or more options ..." }: AppMultiSelectProps) => {
	const getOptionItem = useCallback((item: (typeof options)[0]) => {
		const isValue = typeof item === "string";

		const v = isValue ? item : item?.value;
		const l = isValue ? item : item?.label ?? item?.value;

		return { value: v, label: l };
	}, []);
	return control ? (
		<div className="flex flex-col">
			<p className="text-sm mb-2">{label}</p>
			<Controller
				control={control}
				name={name}
				render={({ field: { onChange: onControlledChange, value: changedValue } }) => (
					<Select
						isMulti
						options={options.map((opt) => getOptionItem(opt))}
						value={changedValue}
						onChange={(val) => {
							onControlledChange(val);
						}}
						placeholder={placeholder}
						className="text-sm"
						components={animatedComponents}
						styles={{
							input: (base) => ({
								...base,
								"input:focus": {
									boxShadow: "none !important",
								},
							}),
							// On mobile, the label will truncate automatically, so we want to
							// override that behaviour.
							multiValueLabel: (base) => ({
								...base,
								whiteSpace: "normal",
								overflow: "visible",
							}),
							control: (base) => ({
								...base,
								transition: "none",
							}),
						}}
						unstyled
						classNames={{
							control: ({ isFocused }) => clsx(isFocused ? controlStyles.focus : controlStyles.nonFocus, controlStyles.base, !isFocused && "z-0"),
							placeholder: () => placeholderStyles,
							input: () => selectInputStyles,
							valueContainer: () => valueContainerStyles,
							singleValue: () => singleValueStyles,
							multiValue: () => multiValueStyles,
							multiValueLabel: () => multiValueLabelStyles,
							multiValueRemove: () => multiValueRemoveStyles,
							indicatorsContainer: () => indicatorsContainerStyles,
							clearIndicator: () => clearIndicatorStyles,
							indicatorSeparator: () => indicatorSeparatorStyles,
							dropdownIndicator: () => dropdownIndicatorStyles,
							menu: () => menuStyles,
							groupHeading: () => groupHeadingStyles,
							option: ({ isFocused, isSelected }) => clsx(isFocused && optionStyles.focus, isSelected && optionStyles.selected, optionStyles.base),
							noOptionsMessage: () => noOptionsMessageStyles,
							container: (state) => clsx(containerStyles, !state.isFocused && "z-0"),
						}}
					/>
				)}
			/>
			{helperText && <p className="text-xs text-gray-500">{helperText}</p>}
			{error && <p className="text-xs text-red-500">{error?.message as string}</p>}
		</div>
	) : (
		<div className="flex flex-col w-full">
			<p className="text-sm mb-2">{label}</p>
			<Select
				isMulti
				hideSelectedOptions={true}
				options={options.map((opt) => getOptionItem(opt))}
				value={value}
				onChange={(val) => {
					let newVal = Array.from(val as any).map((v: any) => v?.value);
					setValue && setValue(newVal);
					onChange && onChange(newVal);
				}}
				placeholder={placeholder}
				className="text-sm"
				components={animatedComponents}
				styles={{
					input: (base) => ({
						...base,
						"input:focus": {
							boxShadow: "none !important",
						},
					}),
					// On mobile, the label will truncate automatically, so we want to
					// override that behaviour.
					multiValueLabel: (base) => ({
						...base,
						whiteSpace: "normal",
						overflow: "visible",
					}),
					control: (base) => ({
						...base,
						transition: "none",
					}),
				}}
				unstyled
				classNames={{
					control: ({ isFocused }) => clsx(isFocused ? controlStyles.focus : controlStyles.nonFocus, controlStyles.base, !isFocused && "z-0"),
					placeholder: () => placeholderStyles,
					input: () => selectInputStyles,
					valueContainer: () => valueContainerStyles,
					singleValue: () => singleValueStyles,
					multiValue: () => multiValueStyles,
					multiValueLabel: () => multiValueLabelStyles,
					multiValueRemove: () => multiValueRemoveStyles,
					indicatorsContainer: () => indicatorsContainerStyles,
					clearIndicator: () => clearIndicatorStyles,
					indicatorSeparator: () => indicatorSeparatorStyles,
					dropdownIndicator: () => dropdownIndicatorStyles,
					menu: () => menuStyles,
					groupHeading: () => groupHeadingStyles,
					option: ({ isFocused, isSelected }) => clsx(isFocused && optionStyles.focus, isSelected && optionStyles.selected, optionStyles.base),
					noOptionsMessage: () => noOptionsMessageStyles,
					container: (state) => clsx(containerStyles, !state.isFocused && "z-0"),
				}}
			/>
			{helperText && <p className="text-xs text-gray-500">{helperText}</p>}
			{error && <p className="text-xs text-red-500">{error?.message as string}</p>}
		</div>
	);
};

export default AppMultiSelect;
