"use client";

import { BreadcrumbItem, Breadcrumbs, Divider, Tab, Tabs } from "@nextui-org/react";
import MobilityTab from "./MobilityTab";
import AppliancesTab from "./AppliancesTab";

const TeamEquipments = () => {
	return (
		<>
			<Breadcrumbs>
				<BreadcrumbItem>Configuration</BreadcrumbItem>
				<BreadcrumbItem>Team</BreadcrumbItem>
			</Breadcrumbs>
			<div className="mt-4">
				<h1 className="text-2xl font-bold text-primary-800">Team Equipments</h1>
				<div className="mt-2">
					<hr className="border-saastain-gray border-1" />
				</div>
				<div className="mt-6 space-y-2">
					<h2 className="text-lg font-semibold text-primary-800">Manage Equipments</h2>
					<p className="text-sm text-gray-600 w-full md:w-[80%]">
						Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis
					</p>
				</div>
				<div className="mt-6">
					<Tabs aria-label="Team Equipments Tabs" color="primary" variant="underlined">
						<Tab key={"mobility"} title={"Mobility"}>
							<MobilityTab />
						</Tab>
						<Tab key={"appliances"} title={"Appliances"}>
							<AppliancesTab />
						</Tab>
					</Tabs>
				</div>
			</div>
		</>
	);
};

export default TeamEquipments;
