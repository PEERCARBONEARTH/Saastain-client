import AppSelect from "@/components/forms/AppSelect";
import StationaryCombustionApplianceModal from "./StationaryCombustionApplianceModal";
import { StationaryCombustionAddVariant } from "@/types/Appliances";
import { useMemo } from "react";
import { IBranch } from "@/types/Company";

interface IProps {
	branchesData: IBranch[];
}

const GeneratorsTab = ({ branchesData }: IProps) => {
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

	return (
		<div className="w-full">
			<div className="grid grid-cols-1 md:grid-cols-2">
				<div className="flex items-center gap-4">
					<AppSelect label="Branch" options={generatedBranchOptions} placeholder="Choose Branch ..." />
				</div>
				<div className="flex items-center justify-end">
					<StationaryCombustionApplianceModal variant={StationaryCombustionAddVariant.GENERATORS} />
				</div>
			</div>
		</div>
	);
};

export default GeneratorsTab;
