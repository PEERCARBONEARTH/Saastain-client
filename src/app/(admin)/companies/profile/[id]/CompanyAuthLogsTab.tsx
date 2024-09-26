import AppTable, { IAppTableColumn } from "@/components/table/AppTable";
import { swrFetcher } from "@/lib/api-client";
import { IApiEndpoint } from "@/types/Api";
import { AuthLogStatus, IAuthLog } from "@/types/AuthLog";
import { AppKey } from "@/types/Global";
import { Chip } from "@nextui-org/react";
import { format } from "date-fns";
import { FC, useCallback, useDeferredValue, useState } from "react";
import useSWR from "swr";

interface IProps {
	companyId: string;
}

const columns: IAppTableColumn[] = [
	{
		name: "IP Address",
		uid: "ipAddr",
		sortable: true,
	},
	{
		name: "Email",
		uid: "email",
		sortable: true,
	},
	{
		name: "User",
		uid: "user",
	},
	{
		name: "Status",
		uid: "status",
		sortable: true,
	},
	{
		name: "Created At",
		uid: "createdAt",
		sortable: true,
	},
];

const chipColor = {
	[AuthLogStatus.SUCCESS]: "primary",
	[AuthLogStatus.FAILED]: "danger",
};

const CompanyAuthLogsTab: FC<IProps> = ({ companyId }) => {
	const [rowsPerPage, setRowsPerPage] = useState<number>(10);
	const [searchValue, setSearchValue] = useState<string>("");
	const [currentPage, setCurrentPage] = useState<number>(1);

	const search = useDeferredValue(searchValue);

	const renderCell = useCallback((item: IAuthLog, columnKey: AppKey) => {
		switch (columnKey) {
			case "ipAddr":
				return <span>{item.ipAddr}</span>;
			case "email":
				return <span>{item.email}</span>;
			case "user":
				return <span>{item?.user?.name ?? "None"}</span>;
			case "status":
				return (
					<Chip size="sm" color={chipColor[item.status] as any}>
						{item?.status}
					</Chip>
				);
			case "createdAt":
				return <span>{format(new Date(item.createdAt), "yyyy-MM-dd HH:mm:ss")}</span>;
			default:
				return null;
		}
	}, []);

	const { data, isLoading } = useSWR<{ authLogs: IAuthLog[]; total: number }>(
		!companyId ? null : [`${IApiEndpoint.GET_ALL_AUTH_LOGS_PAGINATED_BY_COMPANY}/${companyId}`, { page: currentPage, limit: rowsPerPage, search }],
		swrFetcher,
		{
			keepPreviousData: true,
		}
	);
	return (
		<>
			<h1 className="text-lg font-medium">Shows a List of Times Users of this company logged in to SaaStain Platform</h1>
			<AppTable<IAuthLog>
				title="Auth Logs"
				data={data?.authLogs ?? []}
				count={data?.total ?? 0}
				headerColumns={columns}
				isLoading={isLoading}
				renderCell={renderCell}
				rowsPerPage={rowsPerPage}
				onRowsPerPageChange={setRowsPerPage}
				searchValue={searchValue}
				onSearch={setSearchValue}
				currentPage={currentPage}
				onCurrentPageChange={setCurrentPage}
				searchPlaceholder="Search by email or ip"
				columnsToShowOnMobile={["email", "user", "createdAt"]}
			/>
		</>
	);
};

export default CompanyAuthLogsTab;
