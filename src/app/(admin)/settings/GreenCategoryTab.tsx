import AddNewGreenCategoryModal from "@/components/modals/AddNewGreenCategoryModal";
import AppTable, { IAppTableColumn } from "@/components/table/AppTable";
import CustomText from "@/components/typography/CustomText";
import { swrFetcher } from "@/lib/api-client";
import { IApiEndpoint } from "@/types/Api";
import { AppKey } from "@/types/Global";
import { IGreenCategory } from "@/types/GreenCategory";
import { Button } from "@heroui/react";
import { useCallback } from "react";
import useSWR from "swr";

const categoryColumns: IAppTableColumn[] = [
	{
		name: "Category Name",
		uid: "title",
	},
	{
		name: "Description",
		uid: "description",
	},
	{
		name: "Actions",
		uid: "actions",
	},
];

const GreenCategoryTab = () => {
	const renderCategoryCell = useCallback((item: IGreenCategory, columnKey: AppKey) => {
		const value = item[columnKey as keyof IGreenCategory];

		switch (columnKey) {
			case "title":
				return <CustomText>{value}</CustomText>;
			case "description":
				return <CustomText>{value}</CustomText>;
			case "actions":
				return (
					<div className="flex items-center gap-3">
						<Button color="primary" size="sm" variant="flat">
							Edit
						</Button>
						<Button color="danger" size="sm" variant="flat">
							Delete
						</Button>
					</div>
				);
			default:
				return null;
		}
	}, []);

	const { data, isLoading, mutate } = useSWR<IGreenCategory[]>([IApiEndpoint.GET_GREEN_PRODUCT_CATEGORIES], swrFetcher, { keepPreviousData: true });

	return (
		<>
			<div className="space-y-3 pb-3 border-b-1.5 border-[#A7B3A7]">
				<h1 className="text-xl font-bold text-green-900">Green Categories</h1>
				<p className="text-[#6B7280]">iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati</p>
			</div>
			<div className="my-5">
				<AppTable<IGreenCategory>
					title={"Green Categories"}
					data={data ?? []}
					headerColumns={categoryColumns}
					renderCell={renderCategoryCell}
					count={data?.length ?? 0}
					showBottomContent={false}
					isLoading={isLoading}>
					<AddNewGreenCategoryModal mutate={mutate} />
				</AppTable>
			</div>
		</>
	);
};

export default GreenCategoryTab;
