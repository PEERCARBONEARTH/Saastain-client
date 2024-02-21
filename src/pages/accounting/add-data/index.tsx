import AppLayout from "@/layouts/AppLayout";
import { NextPageWithLayout } from "@/types/Layout";
import { BreadcrumbItem, Breadcrumbs, Input } from "@nextui-org/react";
import { SearchIcon } from "lucide-react";
import AddDataCardItem, { AddDataCardItemProps } from "@/components/cards/AddDataCardItem";
import { addDataScopes } from "@/data/add-data-scopes";
import { useDeferredValue, useMemo, useState } from "react";
import Head from "next/head";

const filterScopesData = (data: AddDataCardItemProps[], search: string) => {
	// enable search by title or scope and non-case sensitive
	return data.filter((item) => item.title.toLowerCase().includes(search.toLowerCase()) || item.scope.toLowerCase().includes(search.toLowerCase()));
};

const AddData: NextPageWithLayout = () => {
	const [search, setSearch] = useState<string>("");

	const searchValue = useDeferredValue(search);

	const addDataScopesFiltered = useMemo(() => filterScopesData(addDataScopes, searchValue), [searchValue]);
	return (
		<div className="px-4 md:px-12">
			<Head>
				<title>Add Data - SaaStain</title>
			</Head>
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
					value={search}
					onChange={(e) => setSearch(e.target.value)}
				/>
			</div>
			<ul className="space-y-2 list-disc text-sm my-3 px-4 mb-4">
				<li>Here, you have the power to build a comprehensive emissions profile by entering your transactional or spend-based data across various categories.</li>
				<li>By meticulously recording your activities and expenditures, you'll gain valuable insights into your carbon footprint.</li>
				<li>Whether it's travel, energy usage, or everyday purchases, every entry brings you one step closer to your complete impact assessment.</li>
			</ul>
			<div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-10">
				{addDataScopesFiltered.length === 0 && (
					<div className="col-span-3 text-center">
						<p className="text-default-500">No results found</p>
					</div>
				)}
				{addDataScopesFiltered?.map((item, i) => (
					<AddDataCardItem key={i} {...item} />
				))}
			</div>
		</div>
	);
};

AddData.getLayout = (c) => <AppLayout>{c}</AppLayout>;

export default AddData;
