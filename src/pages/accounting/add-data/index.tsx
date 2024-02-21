import AppLayout from "@/layouts/AppLayout";
import { NextPageWithLayout } from "@/types/Layout";
import { BreadcrumbItem, Breadcrumbs, Input } from "@nextui-org/react";
import { SearchIcon } from "lucide-react";
import AddDataCards from "@/components/cards/add-data-cards";

const AddData: NextPageWithLayout = () => {
	return (
		<div className="px-4 md:px-12">
			<Breadcrumbs>
				<BreadcrumbItem>Accounting</BreadcrumbItem>
				<BreadcrumbItem>Add Data</BreadcrumbItem>
			</Breadcrumbs>
			<div className="flex justify-between my-6 md:items-center flex-col md:flex-row space-y-2 md:space-y-0">
				<h2 className="text-xl md:text-4xl text-bold">Record your carbon footprint data</h2>
				<Input
					classNames={{
						base: "max-w-full sm:max-w-[20rem] h-10",
						mainWrapper: "h-full",
						input: "text-small",
						inputWrapper: "h-full font-normal text-default-600 rounded-2xl",
					}}
					placeholder="Type to search..."
					size="sm"
					startContent={<SearchIcon size={18} />}
					type="search"
					variant="bordered"
				/>
			</div>
			<ul className="space-y-2 list-disc text-sm my-3 px-4 mb-4">
				<li>Here, you have the power to build a comprehensive emissions profile by entering your transactional or spend-based data across various categories.</li>
				<li>By meticulously recording your activities and expenditures, you'll gain valuable insights into your carbon footprint.</li>
				<li>Whether it's travel, energy usage, or everyday purchases, every entry brings you one step closer to your complete impact assessment.</li>
			</ul>
			<AddDataCards />
		</div>
	);
};

AddData.getLayout = (c) => <AppLayout>{c}</AppLayout>;

export default AddData;
