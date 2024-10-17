import AppSelect from "@/components/forms/AppSelect";
import { generateOptions } from "@/utils";
import FleetAddModal from "./FleetAddModal";
import { FleetAddVariant } from "@/types/Fleet";

const branchOpts = ["All", "Branch 1", "Branch 2", "Branch 3"];

const PassengerVehiclesTab = () => {
	return (
		<div className="w-full">
			<div className="grid grid-cols-1 md:grid-cols-2">
				<div className="flex items-center gap-4">
					<AppSelect label="Branch" options={generateOptions(branchOpts)} placeholder="Choose Branch ..." />
				</div>
				<div className="flex items-center justify-end">
					<FleetAddModal variant={FleetAddVariant.PASSENGER} />
				</div>
			</div>
		</div>
	);
};

export default PassengerVehiclesTab;
