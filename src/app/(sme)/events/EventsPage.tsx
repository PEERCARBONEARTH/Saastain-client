"use client";

import AppSelect from "@/components/forms/AppSelect";
import AppTable, { IAppTableColumn } from "@/components/table/AppTable";
import { AppKey } from "@/types/Global";
import { generateOptions } from "@/utils";
import { BreadcrumbItem, Breadcrumbs, Button, Chip } from "@heroui/react";
import { format } from "date-fns";
import { useCallback } from "react";
import { HiCalendar } from "react-icons/hi2";

interface IEvent {
	id: string;
	name: string;
	emissions: number;
	startDate: string;
	endDate: string;
	industry: string;
	stage: string;
}

const mockEvents: IEvent[] = [
	{
		id: "evt-001",
		name: "Tech Innovation Summit 2024",
		emissions: 45.8,
		startDate: "2024-06-15",
		endDate: "2024-06-17",
		industry: "Technology",
		stage: "Planning",
	},
	{
		id: "evt-002",
		name: "Green Energy Conference",
		emissions: 32.3,
		startDate: "2024-07-22",
		endDate: "2024-07-24",
		industry: "Energy",
		stage: "Confirmed",
	},
	{
		id: "evt-003",
		name: "Sustainable Fashion Week",
		emissions: 67.2,
		startDate: "2024-08-10",
		endDate: "2024-08-15",
		industry: "Fashion",
		stage: "In Progress",
	},
	{
		id: "evt-004",
		name: "Global Finance Forum",
		emissions: 89.5,
		startDate: "2024-09-05",
		endDate: "2024-09-07",
		industry: "Finance",
		stage: "Planning",
	},
	{
		id: "evt-005",
		name: "EcoTourism Summit",
		emissions: 54.1,
		startDate: "2024-10-12",
		endDate: "2024-10-14",
		industry: "Tourism",
		stage: "Confirmed",
	},
	{
		id: "evt-006",
		name: "Healthcare Innovation Expo",
		emissions: 41.7,
		startDate: "2024-11-08",
		endDate: "2024-11-10",
		industry: "Healthcare",
		stage: "Planning",
	},
	{
		id: "evt-007",
		name: "Sustainable Agriculture Conference",
		emissions: 28.9,
		startDate: "2024-12-03",
		endDate: "2024-12-05",
		industry: "Agriculture",
		stage: "Draft",
	},
	{
		id: "evt-008",
		name: "Clean Tech Showcase",
		emissions: 35.6,
		startDate: "2025-01-15",
		endDate: "2025-01-17",
		industry: "Technology",
		stage: "Draft",
	},
];

const columns: IAppTableColumn[] = [
	{
		name: "Name",
		uid: "name",
	},
	{
		name: "Emissions",
		uid: "emissions",
	},
	{
		name: "Duration",
		uid: "duration",
	},
	{
		name: "Industry",
		uid: "industry",
	},
	{
		name: "Stage",
		uid: "stage",
	},
	{
		name: "Actions",
		uid: "actions",
	},
];

const EventsPage = () => {
	const renderCell = useCallback((item: IEvent, columnKey: AppKey) => {
		switch (columnKey) {
			case "name":
				return <span>{item.name}</span>;
			case "emissions":
				return <span>{item.emissions}tCO2e</span>;
			case "duration":
				return (
					<div className="">
						{format(new Date(item.startDate), "PPP")} - {format(new Date(item.endDate), "PPP")}
					</div>
				);
			case "industry":
				return <Chip size="sm" color="primary">{item.industry}</Chip>;
			case "stage":
				return <Chip size="sm" color="warning">{item.stage}</Chip>;
			case "actions":
				return (
					<Button size="sm" color="primary" variant="bordered">
						View
					</Button>
				);
			default:
				return null;
		}
	}, []);
	return (
		<>
			<Breadcrumbs>
				<BreadcrumbItem>Neutral Events</BreadcrumbItem>
				<BreadcrumbItem>Events</BreadcrumbItem>
			</Breadcrumbs>
			<div className="px-5 py-3 rounded-xl border-[0.5px] border-saastain-gray mt-5 bg-white">
				<div className="flex items-end justify-between">
					<div className="">
						<h1 className="text-gray-700 text-3xl font-bold">Your Events</h1>
						<p className="text-gray-700 text-sm font-medium">View key details, monitor sustainability progress, and ensure each event aligns with your carbon-neutral goals.</p>
					</div>
					<Button color="primary" endContent={<HiCalendar className="w-5 h-5" />}>
						New Event
					</Button>
				</div>
				<div className="mt-5">
					<AppTable<IEvent> title={"Events"} data={mockEvents} count={mockEvents.length} renderCell={renderCell} headerColumns={columns} isLoading={false}>
                        <div className="flex items-center gap-10">
                            <p>Filter By</p>
                            <AppSelect options={generateOptions(['Industry', 'Stage'])} />
                        </div>
                    </AppTable>
				</div>
			</div>
		</>
	);
};

export default EventsPage;
