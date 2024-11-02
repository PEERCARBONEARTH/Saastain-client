import useDidHydrate from "@/hooks/useDidHydrate";
import { IBranch } from "@/types/Company";
import { useSession } from "next-auth/react";
import { useMemo } from "react";
import ProcessingFugitiveEquipmentModal from "./ProcessingFugitiveEquipmentModal";
import { ProcessingEquipmentCategory } from "@/types/EquipmentMobility";
import { ProcessingEmissionAddVariant } from "@/types/ProcessingAndFugitive";

interface IProps {
	branchesData: IBranch[];
}

const ChemicalReactionEquipmentsTab = ({ branchesData }: IProps) => {
	const { data: session, status } = useSession();
	const { didHydrate } = useDidHydrate();

	const userInfo = useMemo(() => {
		if (didHydrate && status === "authenticated") {
			return session?.user;
		}

		return null;
	}, [status, didHydrate]);

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
				<div className="flex items-center gap-4"></div>
				<div className="flex items-center justify-end">
					<ProcessingFugitiveEquipmentModal variant={ProcessingEquipmentCategory.PROCESSING} category={ProcessingEmissionAddVariant.CHEMICAL_REACTIONS} />
				</div>
			</div>
            <div className="mt-5">
                {/* Table should go here */}
            </div>
		</div>
	);
};

export default ChemicalReactionEquipmentsTab;
