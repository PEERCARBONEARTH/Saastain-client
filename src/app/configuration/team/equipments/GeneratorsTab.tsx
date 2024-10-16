import AppSelect from "@/components/forms/AppSelect";
import { generateOptions } from "@/utils";
import StationaryCombustionApplianceModal from "./StationaryCombustionApplianceModal";
import { StationaryCombustionAddVariant } from "@/types/Appliances";

const branchOpts = ["All", "Branch 1", "Branch 2", "Branch 3"];

const GeneratorsTab = () => {
	return (
		<div className="w-full">
			<div className="grid grid-cols-1 md:grid-cols-2">
				<div className="flex items-center gap-4">
					<AppSelect label="Branch" options={generateOptions(branchOpts)} placeholder="Choose Branch ..." />
				</div>
				<div className="flex items-center justify-end">
					<StationaryCombustionApplianceModal variant={StationaryCombustionAddVariant.GENERATORS} />
				</div>
			</div>
		</div>
	);
};

export default GeneratorsTab;
