"use client";
import { Button, Card, CardBody, CardFooter, CardHeader, Divider, Progress, Spacer, CheckboxProps, useCheckbox, tv, VisuallyHidden, Chip, CheckboxGroup } from "@nextui-org/react";
import { CheckIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

const CompanyType = () => {
	const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
	return (
		<div className="grid grid-cols-4">
			<div className="col-span-3">
				<div className="w-full h-screen">
					<div className="flex flex-col items-center justify-center h-full px-28">
						<Progress value={100} color="warning" className="w-full" />
						<div className="mt-5 w-full">
							<Card className="w-full px-5">
								<CardHeader>
									<Button variant="light" color="primary" startContent={<ChevronLeft className="w-5 h-5" />}>
										Back
									</Button>
								</CardHeader>
								<Divider />
								<CardBody>
									<h1 className="text-xl font-bold">Where does your company lie ?</h1>
									<Spacer y={7} />
									<CheckboxGroup className="gap-1" orientation="horizontal" value={selectedIndustries} onChange={setSelectedIndustries}>
										<CustomCheckbox value={"agriculture"}>Agriculture</CustomCheckbox>
										<CustomCheckbox value={"aviation"}>Aviation</CustomCheckbox>
										<CustomCheckbox value={"banking"}>Banking</CustomCheckbox>
										<CustomCheckbox value={"manufacturing"}>Manufacturing</CustomCheckbox>
										<CustomCheckbox value={"logistics"}>Logistics & Travel</CustomCheckbox>
									</CheckboxGroup>
								</CardBody>
								<CardFooter className="justify-end">
									<Button className="bg-primary-800 text-white" endContent={<ChevronRight className="w-5 h-5" />}>
										Next
									</Button>
								</CardFooter>
							</Card>
						</div>
					</div>
				</div>
			</div>
			<div className="col-span-1">
				<div className="bg-create-company h-screen"></div>
			</div>
		</div>
	);
};

const checkbox = tv({
	slots: {
		base: "border-default hover:bg-default-200",
		content: "text-default-500",
	},
	variants: {
		isSelected: {
			true: {
				base: "border-primary bg-primary-100 hover:bg-primary-200 hover:border-primary-200",
				content: "text-primary pl-1",
			},
		},
		isFocusVisible: {
			true: {
				base: "outline-none ring-2 ring-focus ring-offset-2 ring-offset-background",
			},
		},
	},
});

const CustomCheckbox = (props: CheckboxProps) => {
	const { children, isSelected, isFocusVisible, getBaseProps, getLabelProps, getIconProps, getInputProps } = useCheckbox({ ...props });

	const styles = checkbox({ isSelected, isFocusVisible });

	return (
		<label {...getBaseProps()}>
			<VisuallyHidden>
				<input {...getInputProps()} />
			</VisuallyHidden>
			<Chip
				classNames={{ base: styles.base(), content: styles.content() }}
				radius="sm"
				color="primary"
				variant={isSelected ? "flat" : "faded"}
				size="lg"
				startContent={isSelected ? <CheckIcon className="ml-1 w-5 h-5 text-primary" /> : null}
				{...(getLabelProps() as any)}>
				<span className="text-sm">{children ? children : isSelected ? "Enabled" : "Disabled"}</span>
			</Chip>
		</label>
	);
};

export default CompanyType;
