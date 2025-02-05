import AppTable, { IAppTableColumn } from "@/components/table/AppTable";
import { AppKey } from "@/types/Global";
import { IVehicleEmissionData } from "@/types/VehicleEmissions";
import { Button } from "@heroui/react";
import { Trash2 } from "lucide-react";
import { useCallback, useDeferredValue, useState } from "react";
import { FiEdit3 } from "react-icons/fi";
import NewVehicleEmissionFactorData from "./NewVehicleEmissionFactorData";
import NewModelForMakeModal from "./NewModelForMakeModal";
import useSWR from "swr";
import { IApiEndpoint } from "@/types/Api";
import { swrFetcher } from "@/lib/api-client";

const columns: IAppTableColumn[] = [
	{
		name: "Make",
		uid: "make",
	},
	{
		name: "Model",
		uid: "model",
	},
	{
		name: "Emisssion Factor Per KM (g)",
		uid: "co2e_gm",
	},
	{
		name: "Actions",
		uid: "actions",
	},
];

const VehicleEmissionsConfig = () => {
	const [searchValue, setSearchValue] = useState<string>("");
	const [currentPage, setCurrentPage] = useState<number>(1);
	const [limitPerPage, setLimitPerPage] = useState<number>(10);

	const search = useDeferredValue(searchValue);

	const renderCell = useCallback((item: IVehicleEmissionData, columnKey: AppKey) => {
		switch (columnKey) {
			case "make":
				return <span>{item.make}</span>;
			case "model":
				return <span>{item.model}</span>;
			case "co2e_gm":
				return <span>{Number(item.co2e_gm).toFixed(3)}</span>;
			case "actions":
				return (
					<div className="flex items-center gap-3">
						<Button isIconOnly color="primary" variant="light">
							<FiEdit3 className="w-5 h-5" />
						</Button>
						<Button isIconOnly color="danger" variant="light">
							<Trash2 className="w-5 h-5" />
						</Button>
					</div>
				);
			default:
				return null;
		}
	}, []);

	const { data, isLoading, mutate } = useSWR<{ results: IVehicleEmissionData[]; count: number }>([IApiEndpoint.VEHICLE_EMISSIONS_PAGINATED, { page: currentPage, search, limit: limitPerPage }], swrFetcher, {
		keepPreviousData: true,
	});

	return (
		<>
			<div className="space-y-3 pb-3 border-b-1.5 border-[#A7B3A7]">
				<h1 className="text-xl font-bold text-green-900">Vehicle Emissions Config</h1>
				<p className="text-[#6B7280]">iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati</p>
			</div>
			<div className="my-5">
				<AppTable<IVehicleEmissionData>
					title={"Vehicle Emissions Factors"}
					data={data?.results ?? []}
					headerColumns={columns}
					count={data?.count ?? 0}
					isLoading={isLoading}
					renderCell={renderCell}
					searchValue={searchValue}
					onSearch={setSearchValue}
					rowsPerPage={limitPerPage}
					onRowsPerPageChange={setLimitPerPage}
					currentPage={currentPage}
					onCurrentPageChange={setCurrentPage}>
					<div className="flex items-center gap-3">
						<NewModelForMakeModal />
						<NewVehicleEmissionFactorData mutate={mutate} />
					</div>
				</AppTable>
			</div>
		</>
	);
};

export default VehicleEmissionsConfig;
