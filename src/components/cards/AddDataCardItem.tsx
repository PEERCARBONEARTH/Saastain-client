import { Button, Card, CardBody, CardFooter, CardHeader } from "@nextui-org/react";
import Link from "next/link";
import { FaArrowRightLong } from "react-icons/fa6";

export interface AddDataCardItemProps {
	intro: string;
	scope: string;
	title: string;
	description: string;
	link: string;
}

const AddDataCardItem = ({ intro, scope, title, description, link }: AddDataCardItemProps) => {
	return (
		<Card className="bg-[#FCF5EB] p-4">
			<CardHeader className="flex flex-col items-start">
				<h3 className="text-xs text-gray-500">{intro}</h3>
				<p className="text-base font-semibold pt-4">{title}</p>
			</CardHeader>
			<CardBody className="text-sm leading-6">{description}</CardBody>
			<CardFooter className="flex justify-between">
			<h3 className="text-xs text-gray-500">{scope}</h3>
				<Button isIconOnly color="warning" className="bg-[#CFA16C]" as={Link} href={`/accounting/add-data/${link}`}>
					<FaArrowRightLong className="w-4 h-4 text-white" />
				</Button>
				
			</CardFooter>
		</Card>
	);
};

export default AddDataCardItem;
