"use client";
import AppInput from "@/components/forms/AppInput";
import AppSelect from "@/components/forms/AppSelect";
import AppTextEditor from "@/components/text-editor/AppTextEditor";
import { generateOptions } from "@/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Card, CardBody, CardFooter, CardHeader, Spacer } from "@nextui-org/react";
import { TrashIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { FC, Fragment } from "react";
import { FormProvider, useFieldArray, useForm, UseFormProps } from "react-hook-form";
import { HiCheck, HiOutlineExternalLink, HiPlus, HiX } from "react-icons/hi";
import { z } from "zod";

interface IProps {
	id: string;
}

const variantTypes = ["Small Meko", "Medium Meko", "Large Meko"];

const formSchema = z.object({
	totalArea: z.string().min(1, "Total Area is required"),
	installationCost: z.preprocess((a) => parseInt(z.string().parse(a), 10), z.number().positive().min(1, "Installation Cost is required")),
	maintenanceCost: z.preprocess((a) => parseInt(z.string().parse(a), 10), z.number().positive().min(1, "Maintenance Cost is required")),
	anyOtherFeedBack: z.string(),
	variantItems: z.array(
		z.object({
			variant: z.string().min(1, "Select Variant"),
			quantity: z.preprocess((a) => parseInt(z.string().parse(a), 10), z.number().positive().min(1, "Add Variant Quantity")),
			unitPrice: z.preprocess((a) => parseInt(z.string().parse(a), 10), z.number().positive().min(1, "Add Unit Price for Variant")),
		})
	),
});

function useZodForm<TSchema extends z.ZodType>(props: Omit<UseFormProps<TSchema["_input"]>, "resolver"> & { schema: TSchema }) {
	const form = useForm<TSchema["_input"]>({
		...props,
		resolver: zodResolver(props.schema, undefined, {
			raw: true,
		}),
	});

	return form;
}

const UpdateQuoteDetailsPage: FC<IProps> = ({ id }) => {
	const router = useRouter();

	const formMethods = useZodForm({
		schema: formSchema,
		defaultValues: {
			totalArea: "",
			installationCost: 1,
			maintenanceCost: 1,
			anyOtherFeedBack: "",
			variantItems: [
				{
					variant: "",
					quantity: 1,
					unitPrice: 1,
				},
			],
		},
	});

	const {
		handleSubmit,
		register,
		control,
		formState: { errors: formErrors },
		reset,
	} = formMethods;

	const { fields, append, remove } = useFieldArray({
		name: "variantItems",
		control,
	});

	const onSubmit = async (data: z.infer<typeof formSchema>) => {};
	return (
		<>
			<div className="pb-2 border-b border-b-saastain-gray">
				<h1 className="text-green-800 text-2xl font-bold">Update Quotation Details</h1>
			</div>
			<div className="mt-5">
				<div className="grid grid-cols-12 gap-5">
					<div className="col-span-8">
						<FormProvider {...formMethods}>
							<form onSubmit={handleSubmit(onSubmit)}>
								<Card shadow="none" className="bg-transparent border">
									<CardBody>
										<AppInput
											name="totalArea"
											control={control}
											error={formErrors.totalArea}
											label={"What is the total area?"}
											placeholder="e.g. 672982"
											helperText="This is the installation area required"
										/>
										<Spacer y={5} />
										<div className="mb-2">
											<label className="block text-sm font-medium leading-6 text-gray-900">How many variants are needed?</label>
										</div>
										{fields.map((field, idx) => {
											const errForField = formErrors?.variantItems?.[idx];

											return (
												<Fragment key={field.id}>
													<div className="grid grid-cols-3 gap-2">
														<AppSelect label="Variant" options={generateOptions(variantTypes)} name={`variantItems.${idx}.variant`} control={control} error={errForField?.variant} />
														<AppInput label={"Quantity"} placeholder="1" name={`variantItems.${idx}.quantity`} control={control} error={errForField?.quantity as any} />
														<div className="flex items-end gap-2">
															<AppInput label={"Unit Price"} placeholder="100000" name={`variantItems.${idx}.unitPrice`} control={control} error={errForField?.unitPrice as any} />
															{idx > 0 && (
																<Button type="button" size="sm" color="danger" variant="flat" onPress={() => remove(idx)} isIconOnly>
																	<TrashIcon />
																</Button>
															)}
														</div>
													</div>
													<Spacer y={5} />
												</Fragment>
											);
										})}
										<div className="grid grid-cols-2">
											<Button
												className="bg-green-100 text-green-700"
												endContent={<HiPlus />}
												type="button"
												onPress={() =>
													append({
														variant: "",
														quantity: 1,
														unitPrice: 1,
													})
												}>
												New Variant
											</Button>
										</div>
										<Spacer y={5} />
										<AppInput
											name="installationCost"
											control={control}
											error={formErrors.installationCost as any}
											label={"What is the installation cost?"}
											placeholder="e.g. 672982"
											helperText="How much will it cost to install?"
										/>
										<Spacer y={5} />
										<AppInput
											name="maintenanceCost"
											control={control}
											error={formErrors.maintenanceCost as any}
											label={"What is the maintenance cost?"}
											placeholder="e.g. 672982"
											helperText="How much will it cost to maintain?"
										/>
										<Spacer y={5} />
										<AppTextEditor label="Any other feedback" name="anyOtherFeedback" control={control} error={formErrors.anyOtherFeedBack} />
									</CardBody>
									<CardFooter>
										<div className="flex items-center justify-end w-full gap-5">
											<Button type="button" onPress={router.back} color="danger" variant="bordered" endContent={<HiX className="w-5 h-5" />}>
												Cancel
											</Button>
											<Button type="submit" color="primary" endContent={<HiCheck className="w-5 h-5" />}>
												Update
											</Button>
										</div>
									</CardFooter>
								</Card>
							</form>
						</FormProvider>
					</div>
					<div className="col-span-4">
						<Card shadow="none" className="bg-transparent border">
							<CardHeader>
								<h1 className="text-green-700 font-bold">Order Details</h1>
							</CardHeader>
							<CardBody>
								<div className="pt-2 space-y-4 pb-4 border-b border-b-saastain-gray">
									<div className="w-full flex items-center justify-between">
										<h3 className="text-gray-500 text-sm font-semibold">Product Name</h3>
										<h3 className="text-gray-800 text-sm font-semibold">Meko Steam Cooking</h3>
									</div>
									<div className="w-full flex items-center justify-between">
										<h3 className="text-gray-500 text-sm font-semibold">No of Order</h3>
										<h3 className="text-gray-800 text-sm font-semibold">4</h3>
									</div>
									<div className="w-full flex items-center justify-between">
										<h3 className="text-gray-500 text-sm font-semibold">Estimated Price</h3>
										<h3 className="text-gray-800 text-sm font-semibold">Ksh 4,000,000</h3>
									</div>
									<div className="w-full flex items-center justify-between">
										<h3 className="text-gray-500 text-sm font-semibold">Actual Price</h3>
										<h3 className="text-gray-800 text-sm font-semibold">Ksh 6,000,000</h3>
									</div>
									<div className="w-full flex items-center justify-between">
										<h3 className="text-gray-500 text-sm font-semibold">Total Area</h3>
										<h3 className="text-gray-800 text-sm font-semibold">---</h3>
									</div>
								</div>
							</CardBody>
							<CardFooter>
								<div className="flex items-center justify-around w-full">
									<Button variant="bordered" endContent={<HiOutlineExternalLink className="w-5 h-5" />}>
										Flag Order
									</Button>
									<Button color="primary" variant="bordered" endContent={<HiOutlineExternalLink className="w-5 h-5" />}>
										More Details
									</Button>
								</div>
							</CardFooter>
						</Card>
					</div>
				</div>
			</div>
		</>
	);
};

const DropdownSelectInput = () => {
	return (
		<div>
			<div className="relative mt-2 rounded-lg shadow-sm">
				<input
					id="price"
					type="text"
					placeholder="4"
					className="block w-full rounded-lg border-0 py-2.5 pr-7 pl-32 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-900 sm:text-sm sm:leading-6 outline-none"
				/>
				<div className="absolute inset-y-0 left-0 flex items-center">
					<label className="sr-only">Currency</label>
					<select className="h-full rounded-lg border-0 bg-transparent py-0 pl-3 text-gray-500 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm">
						<option>Small Meko</option>
						<option>Medium Meko</option>
						<option>Large Meko</option>
					</select>
				</div>
			</div>
		</div>
	);
};

export default UpdateQuoteDetailsPage;
