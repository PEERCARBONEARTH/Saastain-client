
import CompanySummary from "@/components/cards/company-summary";
import SelectBranch from "@/components/select-branch-dashboard";
import SelectYear from "@/components/select-year-dashboard";
import AppLayout from "@/layouts/AppLayout";
import { NextPageWithLayout } from "@/types/Layout";
import {BreadcrumbItem, Breadcrumbs, Button, Input} from "@nextui-org/react";
import Image from "next/image";
import { SearchIcon } from "lucide-react";
import AddDataCards from "@/components/cards/add-data-cards";

const AddData: NextPageWithLayout = () => {
	return <div className="px-12">
		      <Breadcrumbs>
				<BreadcrumbItem>Accounting</BreadcrumbItem>
				<BreadcrumbItem>Add Data</BreadcrumbItem>
			</Breadcrumbs>

        <div className="flex justify-between pt-12">
            <p className="text-4xl text-bold">Record  your carbon footprint data</p>

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
        <p className="py-12">
            Here, you have the power to build a comprehensive emissions profile by entering your transactional or 
            spend-based data across various categories. By meticulously recording your activities and expenditures,
             you'll gain valuable insights into your carbon footprint. Whether it's travel, energy usage, or everyday purchases,
              every entry brings you one step closer to your complete impact assessment.
        </p>
        <AddDataCards/>

</div>
};

AddData.getLayout = (c) => <AppLayout>{c}</AppLayout>;

export default AddData;
