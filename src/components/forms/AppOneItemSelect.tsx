import { useCallback } from "react";
import { Control, Controller, FieldError } from "react-hook-form";
import Select, { ClearIndicatorProps, DropdownIndicatorProps, components } from "react-select";
import makeAnimated from "react-select/animated";
import clsx from "clsx";
import { ChevronDownIcon, XIcon } from "lucide-react";
import { IOption } from "@/types/Forms";
import { capitalize } from "@/utils";

interface AppOneItemSelectProps {
	name?: string;
	label: string;
	value?: string;
	setValue?: (value: string) => void;
	isRequired?: boolean;
	error?: FieldError;
	helperText?: string;
	options: (IOption | string)[];
	control?: Control<any>;
	placeholder?: string;
	onChange?: (val: string) => void;
	zIndex?: number;
	hideSelectedOptions?: boolean;
}

const generateOptions = (options: (string | IOption)[]) => {
	return options.map((opt) => {
		const isValue = typeof opt === "string";

		const v = isValue ? opt : opt?.value;
		const l = isValue ? opt : opt?.label ?? opt?.value;

		return { value: v, label: l } as IOption;
	});
};

const DropdownIndicator = (props: DropdownIndicatorProps) => {
	return (
		// @ts-expect-error
		<components.DropdownIndicator {...props}>
			<ChevronDownIcon className="w-5 h-5" />
		</components.DropdownIndicator>
	);
};
const ClearIndicator = (props: ClearIndicatorProps) => {
	return (
		// @ts-expect-error
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
const menuStyles = "p-1 mt-2 border border-gray-200 bg-white rounded-lg z-[999]";
const groupHeadingStyles = "ml-3 mt-2 mb-1 text-gray-500 text-sm";
const optionStyles = {
	base: "hover:cursor-pointer px-3 py-2 rounded",
	focus: "bg-gray-100 active:bg-gray-200",
	selected: "after:content-['✔'] after:ml-2 after:text-purple-500 text-gray-500",
};
const noOptionsMessageStyles = "text-gray-500 p-2 bg-gray-50 border border-dashed border-gray-200 rounded-sm";
const containerStyles = "bg-white rounded-lg border border-gray-200";

const AppOneItemSelect = ({ name, label, options, value, setValue, onChange, error, helperText, control, placeholder = "Select an option ...", hideSelectedOptions = false }: AppOneItemSelectProps) => {
	const getOptionItem = useCallback((item: (typeof options)[0]) => {
		const isValue = typeof item === "string";

		const v = isValue ? item : item?.value;
		const l = isValue ? item : item?.label ?? item?.value;

		return { value: v, label: l } as IOption;
	}, []);

	return control ? (
		<div className="flex flex-col">
			<p className="text-sm mb-2 text-purple-500">{label}</p>
			<Controller
				control={control}
				name={name}
				render={({ field: { onChange: onControlledChange, value: changedValue } }) => (
					<Select
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
						hideSelectedOptions={hideSelectedOptions}
					/>
				)}
			/>
			{helperText && <p className="text-xs text-gray-500">{helperText}</p>}
			{error && <p className="text-xs text-red-500">{error?.message as string}</p>}
		</div>
	) : (
		<div className="flex flex-col w-full">
			<p className="text-sm mb-2 text-purple-700 font-medium">{label}</p>
			<Select
				options={generateOptions(options)}
				onChange={(val: IOption) => {
					setValue && setValue(val.value);
					onChange && onChange(val.value);
				}}
				getOptionLabel={(option: IOption) => option.label}
				getOptionValue={(option: IOption) => option.value}
				placeholder={value ? capitalize(value) : placeholder}
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
				hideSelectedOptions={hideSelectedOptions}
			/>
			{helperText && <p className="text-xs text-gray-500">{helperText}</p>}
			{error && <p className="text-xs text-red-500">{error?.message as string}</p>}
		</div>
	);
};

export default AppOneItemSelect;
