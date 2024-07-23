"use client";
import { BreadcrumbItem, Breadcrumbs, Button, Chip } from "@nextui-org/react";
import { useCallback, useMemo } from "react";
import { MdAdd } from "react-icons/md";
import { AppKey } from "@/types/Global";
import { ChevronRight } from "lucide-react";
import { vendorItems } from "@/data/vendor-products";
import Link from "next/link";
import { AppEnumRoutes } from "@/types/AppEnumRoutes";
import AppTable, { IAppTableColumn } from "@/components/table/AppTable";
import useDidHydrate from "@/hooks/useDidHydrate";
import { useSession } from "next-auth/react";
import useSWR from "swr";
import { IGreenProduct } from "@/types/GreenProduct";
import { IApiEndpoint } from "@/types/Api";
import { swrFetcher } from "@/lib/api-client";

interface IProductItem {
	id: string;
	name: string;
	createdAt: string;
	categories: string;
	sdg: ISDG[];
	// ordersMade: number;
}

interface ISDG {
    id: string;
    title: string;
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
		uid: "categories",
	},
	{
		name: "SDG Impact",
		uid: "sdg",
	},
	// {
	// 	name: "Orders Made",
	// 	uid: "ordersMade",
	// },
	{
		name: "Actions",
		uid: "actions",
	},
];

const MyProducts = () => {
	const { data: session } = useSession();
	const { didHydrate } = useDidHydrate();

	const account = useMemo(() => {
		if (didHydrate && session?.user) {
			return session?.user;
		}

		return null;
	}, [session]);

	const renderCell = useCallback((item: IProductItem, columnKey: AppKey) => {
		switch (columnKey) {
			case "name":
				return <p>{item.name}</p>;
			case "createdAt":
				return <p>{item.createdAt}</p>;
			case "categories":
				return <p>{item.categories}</p>;
			case "sdg":
				const sdg = item.sdg.map(sdgItem => sdgItem.title).join(", ");
				return <p>{sdg}</p>;
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

	//const { data } = useSWR<IGreenProduct[]>([`${IApiEndpoint.GET_VENDOR_PRODUCTS}/${account?.vendorProfile?.id}`], swrFetcher, { keepPreviousData: true });
	const { data = []} = useSWR<IGreenProduct[]>([`${IApiEndpoint.GET_VENDOR_PRODUCTS}`], swrFetcher, { keepPreviousData: true });

	console.log('My Products', data);

	return (
		<>
			<Breadcrumbs>
				<BreadcrumbItem>Vendor</BreadcrumbItem>
				<BreadcrumbItem>My Products</BreadcrumbItem>
			</Breadcrumbs>
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
				<AppTable<IProductItem> headerColumns={productColumns} data={data} count={data?.length} isLoading={false} renderCell={renderCell} title="Products">
					<Button color="primary" startContent={<MdAdd />} as={Link} href={AppEnumRoutes.APP_PRODUCTS_NEW}>
						Add Product
					</Button>
				</AppTable>
			</div>
		</>
	);
};

export default MyProducts;
