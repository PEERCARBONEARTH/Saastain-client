import AppSelect from "@/components/forms/AppSelect";
import { generateOptions } from "@/utils";
import AddApplianceModal from "./AddApplianceModal";

const scopeOpts = ["All", "Scope 1", "Scope 2"];
const branchOpts = ["All", "Branch 1", "Branch 2", "Branch 3"];

const AppliancesTab = () => {
	return (
		<div className="w-full">
			<div className="grid grid-cols-1 md:grid-cols-2">
				<div className="flex items-center gap-4">
					<AppSelect label="Scope" options={generateOptions(scopeOpts)} placeholder="Choose Scope ..." />
					<AppSelect label="Branch" options={generateOptions(branchOpts)} placeholder="Choose Branch ..." />
				</div>
				<div className="flex items-center justify-end">
					<AddApplianceModal />
				</div>
			</div>
		</div>
	);
};

export default AppliancesTab;
