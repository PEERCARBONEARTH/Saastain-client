"use client";
import { BreadcrumbItem, Breadcrumbs, Button, Chip } from "@nextui-org/react";
import { useCallback } from "react";
import { MdAdd } from "react-icons/md";
import { AppKey } from "@/types/Global";
import { ChevronRight } from "lucide-react";
import { vendorItems } from "@/data/vendor-products";
import Link from "next/link";
import { AppEnumRoutes } from "@/types/AppEnumRoutes";
import AppTable, { IAppTableColumn } from "@/components/table/AppTable";

interface IProductItem {
	id: string;
	name: string;
	createdAt: string;
	category: string;
	sdgImpact: string;
	ordersMade: number;
}

const productColumns: IAppTableColumn[] = [
	{
		name: "Item Name",
		uid: "name",
	},
	{
		name: "Date Added",
		uid: "createdAt",
	},
	{
		name: "Category",
		uid: "category",
	},
	{
		name: "SDG Impact",
		uid: "sdgImpact",
	},
	{
		name: "Orders Made",
		uid: "ordersMade",
	},
	{
		name: "Actions",
		uid: "actions",
	},
];

const MyProducts = () => {
	const renderCell = useCallback((item: IProductItem, columnKey: AppKey) => {
		switch (columnKey) {
			case "name":
				return <p>{item.name}</p>;
			case "createdAt":
				return <p>{item.createdAt}</p>;
			case "category":
				return <Chip color="secondary">{item.category}</Chip>;
			case "sdgImpact":
				return <p>{item.sdgImpact}</p>;
			case "ordersMade":
				return <p>{item.ordersMade}</p>;
			case "actions":
				return (
					<Button size="sm" color="primary" endContent={<ChevronRight />} as={Link} href={`${AppEnumRoutes.APP_PRODUCTS_DETAILS}/${item.id}`}>
						View
					</Button>
				);
			default:
				return null;
		}
	}, []);
	return (
		<>
			<div className="flex items-center justify-between">
				<Breadcrumbs>
					<BreadcrumbItem>Vendor</BreadcrumbItem>
					<BreadcrumbItem>My Products</BreadcrumbItem>
				</Breadcrumbs>
				<Button color="primary" startContent={<MdAdd />} as={Link} href={AppEnumRoutes.APP_PRODUCTS_NEW}>
					Add Product
				</Button>
			</div>
			<div className="space-y-4 mt-8">
				<h1 className="font-bold text-2xl">My Products</h1>
				<div className="w-full md:w-[80%]">
					<p>
						Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae
						dicta sunt explicabo
					</p>
				</div>
			</div>
			<div className="mt-8">
				<AppTable<IProductItem> headerColumns={productColumns} data={vendorItems} count={vendorItems.length} isLoading={false} renderCell={renderCell} title="Products" />
			</div>
		</>
	);
};

export default MyProducts;
