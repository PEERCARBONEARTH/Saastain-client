import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface IEquipmentStore {
	equipments: string[];
	addEquipment: (equipment: string) => void;
}

export const useEquipmentsStore = create(
	persist<IEquipmentStore>(
		(set, get) => ({
			equipments: ["Boilers", "Generator", "Heater"],
			addEquipment: (equipment: string) => {
				// ensure the equipment is not already in the list
				const currentEquipments = get().equipments;
				if (!currentEquipments.includes(equipment)) {
					set({ equipments: [...currentEquipments, equipment] });
				}
			},
		}),
		{
			storage: createJSONStorage(() => localStorage),
			name: "saastain-equipments-store",
		}
	)
);
