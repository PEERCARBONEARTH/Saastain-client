import FleetAddModal from "./FleetAddModal";
import { FleetAddVariant } from "@/types/Fleet";
import { IBranch } from "@/types/Company";
import { useCallback, useDeferredValue, useMemo, useState } from "react";
import useDidHydrate from "@/hooks/useDidHydrate";
import { useSession } from "next-auth/react";
import useSWR from "swr";
import { FleetMobilityAccess, IFleetMobility } from "@/types/EquipmentMobility";
import { IApiEndpoint } from "@/types/Api";
import { swrFetcher } from "@/lib/api-client";
import { AppKey } from "@/types/Global";
import AppTable, { IAppTableColumn } from "@/components/table/AppTable";
import { Button, Chip } from "@nextui-org/react";
import { format } from "date-fns";
import { FilterXIcon, Trash2 } from "lucide-react";
import AppNextSelect from "@/components/forms/AppNextSelect";

interface IProps {
	branchesData: IBranch[];
}

const headerColumns: IAppTableColumn[] = [
	{
		name: "Make",
		uid: "make",
		sortable: true,
	},
	{
		name: "Model(s)",
		uid: "model",
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

const PassengerVehiclesTab = ({ branchesData }: IProps) => {
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
		data: fleetData,
		mutate: refetch,
		isLoading: loadingFleet,
	} = useSWR<{ results: IFleetMobility[]; total: number }>(
		!userInfo?.company?.id ? null : [IApiEndpoint.MOBILITY_GET_BY_COMPANY_PAGINATED, { page, limit, companyId: userInfo?.company?.id, search, branch: "", category: FleetAddVariant.PASSENGER }],
		swrFetcher,
		{ keepPreviousData: true }
	);

	const renderCell = useCallback((item: IFleetMobility, columnKey: AppKey) => {
		switch (columnKey) {
			case "make":
				return <span>{item.make}</span>;
			case "model":
				return (
					<div className="flex items-center gap-2">
						{item?.model?.map((modelItem, idx) => (
							<Chip size="sm" color="primary" key={idx}>
								{modelItem}
							</Chip>
						))}
					</div>
				);
			case "createdAt":
				return <span>{format(new Date(item.createdAt), "PPP")}</span>;
			case "branch":
				return (
					<Chip size="sm" color="primary">
						<span>{item?.accessibility === FleetMobilityAccess.GLOBAL ? "All" : item?.branch?.name}</span>
					</Chip>
				);
			case "actions":
				return (
					<div className="flex items-center gap-2">
						<Button size="sm" color="danger" isIconOnly variant="bordered">
							<Trash2 size={16} />
						</Button>
					</div>
				);
			default:
				return null;
		}
	}, []);
	return (
		<div className="w-full">
			<div className="grid grid-cols-1 md:grid-cols-2">
				<div className="flex items-center gap-4">{/* <AppSelect options={generateOptions(branchOpts)} placeholder="Choose Branch ..." /> */}</div>
				<div className="flex items-center justify-end">
					<FleetAddModal variant={FleetAddVariant.PASSENGER} />
				</div>
			</div>
			<div className="mt-5">
				<AppTable<IFleetMobility>
					title="Vehicles"
					data={fleetData?.results ?? []}
					count={fleetData?.total ?? 0}
					renderCell={renderCell}
					headerColumns={headerColumns}
					isLoading={loadingFleet}
					currentPage={page}
					onCurrentPageChange={setPage}
					rowsPerPage={limit}
					onRowsPerPageChange={setLimit}
					emptyContent="No Passenger Vehicles Found"
					searchValue={searchValue}
					onSearch={setSearchValue}
					searchPlaceholder="Search by make">
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

export default PassengerVehiclesTab;
