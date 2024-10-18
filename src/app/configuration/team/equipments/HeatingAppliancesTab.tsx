import StationaryCombustionApplianceModal from "./StationaryCombustionApplianceModal";
import { StationaryCombustionAddVariant } from "@/types/Appliances";
import { IBranch } from "@/types/Company";
import { useCallback, useDeferredValue, useMemo, useState } from "react";
import { EquipmentAccess, IStationaryEquipment } from "@/types/EquipmentMobility";
import AppTable, { IAppTableColumn } from "@/components/table/AppTable";
import AppNextSelect from "@/components/forms/AppNextSelect";
import { Button, Chip } from "@nextui-org/react";
import { FilterXIcon } from "lucide-react";
import RemoveStationaryEquipmentDialog from "./RemoveStationaryEquipmentDialog";
import { format } from "date-fns";
import { AppKey } from "@/types/Global";
import { IApiEndpoint } from "@/types/Api";
import useSWR from "swr";
import { swrFetcher } from "@/lib/api-client";
import { useSession } from "next-auth/react";
import useDidHydrate from "@/hooks/useDidHydrate";

interface IProps {
	branchesData: IBranch[];
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

const HeatingAppliancesTab = ({ branchesData }: IProps) => {
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

	const [page, setPage] = useState<number>(1);
	const [limit, setLimit] = useState<number>(10);
	const [searchValue, setSearchValue] = useState<string>("");
	const [branch, setBranch] = useState<string>("");

	const { data: session, status } = useSession();
	const { didHydrate } = useDidHydrate();

	const userInfo = useMemo(() => {
		if (didHydrate && status === "authenticated") {
			return session?.user;
		}

		return null;
	}, [status, didHydrate]);

	const search = useDeferredValue(searchValue);

	const clearFilters = () => {
		setSearchValue("");
		setBranch("");
	};

	const {
		data: equipmentsData,
		mutate: refetch,
		isLoading: loadingEquipments,
	} = useSWR<{ results: IStationaryEquipment[]; total: number }>(
		!userInfo?.company?.id
			? null
			: [IApiEndpoint.GET_STATIONARY_EQUIPMENTS_BY_CATEGORY_PAGINATED, { page, limit, companyId: userInfo?.company?.id, search, branch: "", category: StationaryCombustionAddVariant.HEATER }],
		swrFetcher,
		{ keepPreviousData: true }
	);

	const renderCell = useCallback((item: IStationaryEquipment, columnKey: AppKey) => {
		switch (columnKey) {
			case "equipmentName":
				return <span>{item.equipmentName}</span>;
			case "createdAt":
				return <span>{format(new Date(item.createdAt), "PPP")}</span>;
			case "branch":
				return (
					<Chip size="sm" color="primary">
						<span>{item?.accessibility === EquipmentAccess.GLOBAL ? "All" : item?.branch?.name}</span>
					</Chip>
				);
			case "actions":
				return (
					<div className="flex items-center gap-2">
						<RemoveStationaryEquipmentDialog equipmentId={item.id} mutate={refetch} />
					</div>
				);
		}
	}, []);
	return (
		<div className="w-full">
			<div className="grid grid-cols-1 md:grid-cols-2">
				<div className="flex items-center gap-4">{/* <AppSelect label="Branch" options={generatedBranchOptions} placeholder="Choose Branch ..." /> */}</div>
				<div className="flex items-center justify-end">
					<StationaryCombustionApplianceModal variant={StationaryCombustionAddVariant.HEATER} mutate={refetch} />
				</div>
			</div>
			<div className="mt-5">
				<AppTable<IStationaryEquipment>
					title="Equipments"
					data={equipmentsData?.results ?? []}
					count={equipmentsData?.total ?? 0}
					renderCell={renderCell}
					headerColumns={columns}
					isLoading={loadingEquipments}
					currentPage={page}
					onCurrentPageChange={setPage}
					rowsPerPage={limit}
					onRowsPerPageChange={setLimit}
					emptyContent="No Equipments found"
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

export default HeatingAppliancesTab;
