"use client";
import AppInput from "@/components/forms/AppInput";
import AppTextEditor from "@/components/text-editor/AppTextEditor";
import { Button, Card, CardBody, CardFooter, CardHeader, Spacer } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { FC } from "react";
import { HiCheck, HiOutlineExternalLink, HiPlus, HiX } from "react-icons/hi";

interface IProps {
	id: string;
}

const UpdateQuoteDetailsPage: FC<IProps> = ({ id }) => {
    const router = useRouter()
	return (
		<>
			<div className="pb-2 border-b border-b-saastain-gray">
				<h1 className="text-green-800 text-2xl font-bold">Update Quotation Details</h1>
			</div>
			<div className="mt-5">
				<div className="grid grid-cols-12 gap-5">
					<div className="col-span-8">
						<Card shadow="none" className="bg-transparent border">
							<CardBody>
								<AppInput label={"What is the actual price"} placeholder="e.g. 672982" helperText="How much will it cost to install this" />
								<Spacer y={5} />
								<div className="">
									<label className="block text-sm font-medium leading-6 text-gray-900">How many variants are needed?</label>
								</div>
								<div className="grid grid-cols-2 gap-2">
									<DropdownSelectInput />
									<DropdownSelectInput />
								</div>
								<Spacer y={5} />
                                <div className="grid grid-cols-2">
                                    <Button className="bg-green-100 text-green-700" endContent={<HiPlus />} >New Variant</Button>
                                </div>
								<Spacer y={5} />
								<AppTextEditor label="Any other feedback" />
							</CardBody>
                            <CardFooter>
                                <div className="flex items-center justify-end w-full gap-5">
                                    <Button onPress={router.back} color="danger" variant="bordered" endContent={<HiX className="w-5 h-5" />} >
                                        Cancel
                                    </Button>
                                    <Button color="primary" endContent={<HiCheck className="w-5 h-5" />} >
                                        Update
                                    </Button>
                                </div>
                            </CardFooter>
						</Card>
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
