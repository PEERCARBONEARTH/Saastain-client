import { OrderStatus } from "./Order";

export const statusColors: Record<OrderStatus, string> = {
	pending: "#EDEBFE",
	"in-progress": "#EDEBFE",
	rejected: "#FDE8E8",
	completed: "#DEF7EC",
	accepted: "#FF5733",
	reverted: "#33FF57",
	"in-loan-review": "#3357FF",
	"approved-by-sme": "#F1C40F",
	"financing-approved": "#8E44AD",
	"rejected-by-sme": "#E67E22",
};

export const statusTextColor: Record<OrderStatus, string> = {
	completed: "#03543F",
	pending: "#5521B5",
	"in-progress": "#5521B5",
	rejected: "#9B1C1C",
	accepted: "#FFFFFF", // White for accepted (background is #FF5733)
	reverted: "#FFFFFF", // White for reverted (background is #33FF57)
	"in-loan-review": "#FFFFFF", // White for in-loan-review (background is #3357FF)
	"approved-by-sme": "#000000", // Black for approved-by-sme (background is #F1C40F)
	"financing-approved": "#FFFFFF", // White for financing-approved (background is #8E44AD)
	"rejected-by-sme": "#FFFFFF", // White for rejected-by-sme (background is #E67E22)
};
