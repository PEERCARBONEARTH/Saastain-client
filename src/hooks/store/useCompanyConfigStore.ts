import { IConfiguration } from "@/types/Configuration";
import { create } from "zustand";

interface ICompanyConfigStore {
	config: IConfiguration | null;
	setConfig: (config: IConfiguration | null) => void;
}

export const useCompanyConfigStore = create<ICompanyConfigStore>((set) => ({
	config: null,
	setConfig(config) {
		set({ config });
	},
}));
