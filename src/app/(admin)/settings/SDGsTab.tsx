import AddNewSDGItemModal from "@/components/modals/AddNewSDGItemModal";
import AppTable, { IAppTableColumn } from "@/components/table/AppTable";
import { swrFetcher } from "@/lib/api-client";
import { IApiEndpoint } from "@/types/Api";
import { AppKey } from "@/types/Global";
import { ISDG } from "@/types/SDG";
import { Button } from "@nextui-org/react";
import Image from "next/image";
import { useCallback } from "react";
import useSWR from "swr";

const columns: IAppTableColumn[] = [
	{
		name: "SDGs",
		uid: "title",
	},
	{
		name: "Actions",
		uid: "actions",
	},
];

const SDGsTab = () => {
	const renderCell = useCallback((item: ISDG, columnKey: AppKey) => {
		switch (columnKey) {
			case "title":
				return (
					<div className="flex items-center gap-2">
						<Image src={item.imageUrl} alt="Img Url" width={60} height={60} />
						<div className="space-y-2">
							<h2 className="text-lg font-semibold">{item.title}</h2>
							<p className="text-gray-600">{item.description}</p>
						</div>
					</div>
				);
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

	const { data: SDGs, isLoading, mutate } = useSWR<ISDG[]>([IApiEndpoint.GET_SDG_ITEMS], swrFetcher, { keepPreviousData: true });
	return (
		<>
			<div className="space-y-3 pb-3 border-b-1.5 border-[#A7B3A7]">
				<h1 className="text-xl font-bold text-green-900">Sustainable Development Goals</h1>
				<p className="text-[#6B7280]">iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati</p>
			</div>
			<div className="my-5">
				<AppTable<ISDG> title={"SDGs"} data={SDGs ?? []} headerColumns={columns} renderCell={renderCell} count={SDGs?.length ?? 0} showBottomContent={false} isLoading={isLoading}>
					<AddNewSDGItemModal mutate={mutate} />
				</AppTable>
			</div>
		</>
	);
};

export default SDGsTab;
