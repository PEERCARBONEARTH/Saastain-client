import useDidHydrate from "@/hooks/useDidHydrate";
import { IBranch } from "@/types/Company";
import { useSession } from "next-auth/react";
import { useCallback, useDeferredValue, useMemo, useState } from "react";
import ProcessingFugitiveEquipmentModal from "./ProcessingFugitiveEquipmentModal";
import { IProcessingEquipment, ProcessingEquipmentAccess, ProcessingEquipmentCategory } from "@/types/EquipmentMobility";
import { ProcessingFugitiveKeyType } from "@/types/ProcessingAndFugitive";
import useSWR from "swr";
import { IApiEndpoint } from "@/types/Api";
import { swrFetcher } from "@/lib/api-client";
import { AppKey } from "@/types/Global";
import { format } from "date-fns";
import { Button, Chip } from "@heroui/react";
import AppTable, { IAppTableColumn } from "@/components/table/AppTable";
import AppNextSelect from "@/components/forms/AppNextSelect";
import { FilterXIcon } from "lucide-react";
import RemoveProcessingFugitiveEquipmentDialog from "./RemoveProcessingFugitiveEquipmentDialog";

interface IProps {
	branchesData: IBranch[];
	category: ProcessingEquipmentCategory;
	subCategory: ProcessingFugitiveKeyType;
}

const columns: IAppTableColumn[] = [
	{
		name: "Name",
		uid: "equipmentName",
		sortable: true,
	},
	{
		name: "Date Added",
		uid: "createdAt",
		sortable: true,
	},
	{
		name: "Branch",
		uid: "branch",
	},
	{
		name: "Actions",
		uid: "actions",
	},
];

const ProcessingFugitiveEquipmentsTab = ({ branchesData, category, subCategory }: IProps) => {
	const { data: session, status } = useSession();
	const { didHydrate } = useDidHydrate();
	const [page, setPage] = useState<number>(1);
	const [limit, setLimit] = useState<number>(10);
	const [searchValue, setSearchValue] = useState<string>("");
	const [branch, setBranch] = useState<string>("");
	const search = useDeferredValue(searchValue);

	const userInfo = useMemo(() => {
		if (didHydrate && status === "authenticated") {
			return session?.user;
		}

		return null;
	}, [status, didHydrate]);

	const generatedBranchOptions = useMemo(() => {
		if (branchesData && branchesData?.length) {
			return branchesData.map((item) => {
				return {
					label: item.name,
					value: item.id,
				};
			});
		}

		return [];
	}, [branchesData]);

	const {
		data: equipmentsData,
		mutate: refetch,
		isLoading: loadingEquipments,
	} = useSWR<{ results: IProcessingEquipment[]; total: number }>(
		!userInfo?.company?.id
			? null
			: [
					IApiEndpoint.PROCESSING_EQUIPMENT_GET_BY_COMPANY_PAGINATED,
					{ page, limit, companyId: userInfo?.company?.id, search, branch: "", category, subCategory: subCategory },
			  ],
		swrFetcher,
		{
			keepPreviousData: true,
		}
	);

	const renderCell = useCallback((item: IProcessingEquipment, columnKey: AppKey) => {
		switch (columnKey) {
			case "equipmentName":
				return <span>{item.equipmentName}</span>;
			case "createdAt":
				return <span>{format(new Date(item.createdAt), "PPP")}</span>;
			case "branch":
				return (
					<Chip size="sm" color="primary">
						<span>{item?.accessibility === ProcessingEquipmentAccess.GLOBAL ? "All" : item?.branch?.name}</span>
					</Chip>
				);
			case "actions":
				return (
					<div className="flex items-center gap-2">
						<RemoveProcessingFugitiveEquipmentDialog equipmentId={item.id} mutate={refetch} />
					</div>
				);
		}
	}, []);

	const clearFilters = () => {
		setSearchValue("");
		setBranch("");
	};

	return (
		<div className="w-full">
			<div className="grid grid-cols-1 md:grid-cols-2">
				<div className="flex items-center gap-4"></div>
				<div className="flex items-center justify-end">
					<ProcessingFugitiveEquipmentModal variant={category} category={subCategory} mutate={refetch} />
				</div>
			</div>
			<div className="mt-5">
				<AppTable<IProcessingEquipment>
					title={"Equipments"}
					data={equipmentsData?.results ?? []}
					count={equipmentsData?.total ?? 0}
					renderCell={renderCell}
					headerColumns={columns}
					isLoading={loadingEquipments}
					currentPage={page}
					onCurrentPageChange={setPage}
					rowsPerPage={limit}
					onRowsPerPageChange={setLimit}
					emptyContent="No equipments added yet."
					searchValue={searchValue}
					onSearch={setSearchValue}
					searchPlaceholder="Search by Equipment Name ...">
					<div className="flex items-end gap-2 w-full">
						<AppNextSelect options={generatedBranchOptions} placeholder="Choose Branch ..." value={branch} setValue={setBranch} />
						<Button isIconOnly onPress={clearFilters}>
							<FilterXIcon className="w-5 h-5" />
						</Button>
					</div>
				</AppTable>
			</div>
		</div>
	);
};

export default ProcessingFugitiveEquipmentsTab;
