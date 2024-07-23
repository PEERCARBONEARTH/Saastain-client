import { IVendorProfile } from "./VendorProfile";

export enum GreenProductStatus {
	DRAFT = "draft",
	PUBLISHED = "published",
	DELETED = "deleted",
}

export interface IGreenProduct {
	id: string;
	createdAt: string;
	updatedAt: string;
	name: string;
	description: string;
	howItWorks: string;
	advantages: string;
	disadvantages: string;
	priceRangeMin: number;
	priceRangeMax: number;
	categories: string;
	sdg: { id: string; title: string }[];
	images: { id: string; url: string }[];
	productVariant: { variant: string; capacity: string }[];
	vendor: IVendorProfile;
	status: GreenProductStatus;
}
