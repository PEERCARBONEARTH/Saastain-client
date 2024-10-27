"use client";
import { IOption } from "@/types/Forms";
import { Button, Chip, cn, Popover, PopoverContent, PopoverTrigger, useDisclosure } from "@nextui-org/react";
import { CheckIcon, ChevronsUpDown } from "lucide-react";
import { Control, Controller, FieldError } from "react-hook-form";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "../ui/command";

interface AppComboboxProps {
	name?: string;
	label?: string;
	value?: string;
	setValue?: (val: string) => void;
	error?: FieldError;
	helperText?: string;
	options: IOption[];
	control?: Control<any>;
	placeholder?: string;
}

const AppCombobox = ({ name, label, value, setValue, error, helperText, options, control, placeholder = "Choose ..." }: AppComboboxProps) => {
	const { isOpen, onOpenChange, onClose } = useDisclosure();
	return control ? (
		<div className="flex flex-col">
			{label && <p className="text-sm mb-2">{label}</p>}
			<Controller
				name={name}
				control={control}
				render={({ field: { onChange: onControlledChange, value: controlledValue } }) => (
					<Popover isOpen={isOpen} onOpenChange={onOpenChange}>
						<PopoverTrigger>
							<Button variant="bordered" role="combobox" className={cn("flex justify-between", !controlledValue && "text-muted-foreground")}>
								{controlledValue ? (
									<Chip size="sm" color="primary" className="text-[12px]">
										{options.find((opt) => opt.value === controlledValue)?.label}
									</Chip>
								) : (
									placeholder
								)}
								<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
							</Button>
						</PopoverTrigger>
						<PopoverContent className="p-0 w-[400px]">
							<Command>
								<CommandInput placeholder={placeholder} />
								<CommandList>
									<CommandEmpty>No option found</CommandEmpty>
									<CommandGroup>
										{options?.map((opt) => (
											<CommandItem
												value={opt.label}
												key={opt.value}
												onSelect={() => {
													onControlledChange(opt.value);
													setTimeout(() => {
														onClose();
													}, 200);
												}}>
												<CheckIcon className={cn("mr-2 h-4 w-4", opt.value === controlledValue ? "opacity-100" : "opacity-0")} />
												{opt.label}
											</CommandItem>
										))}
									</CommandGroup>
								</CommandList>
							</Command>
						</PopoverContent>
					</Popover>
				)}
			/>
			{helperText && <p className="text-xs text-gray-500">{helperText}</p>}
			{error && <p className="text-xs text-red-500">{error?.message as string}</p>}
		</div>
	) : (
		<div className="flex flex-col">
			{label && <p className="text-sm mb-2">{label}</p>}
			<Popover isOpen={isOpen} onOpenChange={onOpenChange}>
				<PopoverTrigger>
					<Button variant="bordered" role="combobox" className={cn("flex justify-between", !value && "text-muted-foreground")}>
						{value ? (
							<Chip size="sm" color="primary" className="text-[12px]">
								{options.find((language) => language.value === value)?.label}
							</Chip>
						) : (
							placeholder
						)}
						<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
					</Button>
				</PopoverTrigger>
				<PopoverContent className="w-[400px] p-0">
					<Command>
						<CommandInput placeholder={placeholder} />
						<CommandList>
							<CommandEmpty>No option found</CommandEmpty>
							<CommandGroup>
								{options?.map((opt) => (
									<CommandItem
										value={opt.label}
										key={opt.value}
										onSelect={() => {
											setValue && setValue(opt.value);
											onClose();
										}}>
										<CheckIcon className={cn("mr-2 h-4 w-4", opt.value === value ? "opacity-100" : "opacity-0")} />
										{opt.label}
									</CommandItem>
								))}
							</CommandGroup>
						</CommandList>
					</Command>
				</PopoverContent>
			</Popover>
			{helperText && <p className="text-xs text-gray-500">{helperText}</p>}
		</div>
	);
};

export default AppCombobox;
