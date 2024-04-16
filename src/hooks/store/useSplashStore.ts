import { create } from "zustand";

export interface SplashStoreData {
	show: boolean;
}

export interface SplashStoreState extends SplashStoreData {
	setShow: (loading: SplashStoreData["show"]) => void;
}

export const useSplashStore = create<SplashStoreState>((set) => ({
	show: false,
	setShow: (show: SplashStoreData["show"]) => set({ show }),
}));
