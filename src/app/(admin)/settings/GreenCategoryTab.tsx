import AddNewGreenCategoryModal from "@/components/modals/AddNewGreenCategoryModal";
import AppTable, { IAppTableColumn } from "@/components/table/AppTable";
import CustomText from "@/components/typography/CustomText";
import { AppKey } from "@/types/Global";
import { IGreenCategory } from "@/types/GreenCategory";
import { Button } from "@nextui-org/react";
import { useCallback } from "react";

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

const greenCategories: IGreenCategory[] = [
	{ id: "1", title: "Recycling", description: "Items that can be recycled" },
	{ id: "2", title: "Composting", description: "Organic waste for compost" },
	{ id: "3", title: "Conservation", description: "Efforts to save resources" },
	{ id: "4", title: "Renewable Energy", description: "Energy from renewable sources" },
	{ id: "5", title: "Eco-Friendly Products", description: "Products that are environmentally friendly" },
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
	return (
		<>
			<div className="space-y-3 pb-3 border-b-1.5 border-[#A7B3A7]">
				<h1 className="text-xl font-bold text-green-900">Green Categories</h1>
				<p className="text-[#6B7280]">iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati</p>
			</div>
			<div className="my-5">
				<AppTable<IGreenCategory>
					title={"Green Categories"}
					data={greenCategories}
					headerColumns={categoryColumns}
					renderCell={renderCategoryCell}
					count={greenCategories.length}
					showBottomContent={false}
					isLoading={false}>
					<AddNewGreenCategoryModal />
				</AppTable>
			</div>
		</>
	);
};

export default GreenCategoryTab;
