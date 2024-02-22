import { Button, Card, CardBody, CardFooter, CardHeader, Link } from "@nextui-org/react";
import { FaArrowRightLong } from "react-icons/fa6";

export interface AddDataCardItemProps {
	scope: string;
	title: string;
	description: string;
	link: string;
}

const AddDataCardItem = ({ scope, title, description, link }: AddDataCardItemProps) => {
	return (
		<Card className="bg-[#FCF5EB] p-4">
			<CardHeader className="flex flex-col items-start">
				<h3 className="font-normal text-sm font">{scope}</h3>
				<p className="text-base font-semibold">{title}</p>
			</CardHeader>
			<CardBody className="text-sm leading-6">{description}</CardBody>
			<CardFooter className="justify-end">
				<Button isIconOnly color="warning" className="bg-[#CFA16C]" as={Link} href={`/accounting/add-data/${link}`}>
					<FaArrowRightLong className="w-4 h-4 text-white" />
				</Button>
			</CardFooter>
		</Card>
	);
};

export default AddDataCardItem;
