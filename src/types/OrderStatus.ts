export enum OrderStatus {
	PENDING = "Pending",
	IN_PROGRESS = "InProgress",
	CANCELLED = "Cancelled",
    COMPLETED = "Completed"
}

export const statusColors: Record<OrderStatus, string> = {
    Pending: "#EDEBFE", 
    InProgress: "#EDEBFE", 
    Cancelled: "#FDE8E8", 
    Completed: "#DEF7EC", 
  };

export const statusTextColor : Record<OrderStatus, string> = {
    Completed: "#03543F",
    Pending: "#5521B5",
    InProgress: "#5521B5",
    Cancelled: "#9B1C1C",
}