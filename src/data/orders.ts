import { OrderStatus } from "@/types/OrderStatus";

export const Orders = [
	{
		id: "MEKO-SM_242424",
		product: "Solar Panels",
		category: "Electronics",
		customer: "Green Energy Solutions",
		deliveryDate: "2023-04-15",
		status: OrderStatus.COMPLETED,
		image: "/images/orderImage.svg"
	},
	{
		id: "MEKO-SM_242425",
		product: "Efficient Stove",
		category: "Clean Cooking",
		customer: "EcoCook",
		deliveryDate: "2023-03-20",
		status: OrderStatus.IN_PROGRESS,
		image: "/images/orderImage.svg"
	},
	{
		id: "MEKO-SM_255424",
		product: "Organic Fertilizer",
		category: "Agriculture",
		customer: "Green Thumb Farms",
		deliveryDate: "2023-03-22",
		status: OrderStatus.PENDING,
		image: "/images/orderImage.svg"
	},
	{
		id: "MEKO-SM_242420",
		product: "Wind Turbine Kit",
		category: "Electronics",
		customer: "Wind Power Co.",
		deliveryDate: "2023-04-01",
		status: OrderStatus.CANCELLED,
		image: "/images/orderImage.svg"
	},
	{
		id: "MEKO-SM_242454",
		product: "Compost Bin",
		category: "Agriculture",
		customer: "Garden Green",
		deliveryDate: "2023-04-05",
		status: OrderStatus.COMPLETED,
		image: "/images/orderImage.svg"
	},
	{
		id: "MEKO-SM_002424",
		product: "Meko Friendly Cooker",
		category: "Clean Cooking",
		customer: "Pure Water Inc.",
		deliveryDate: "2023-03-30",
		status: OrderStatus.IN_PROGRESS,
		image: "/images/orderImage.svg"
	},
	{
		id: "MEKO-SM_99000",
		product: "LED Lighting Kit",
		category: "Electronics",
		customer: "Bright Homes",
		deliveryDate: "2023-04-07",
		status: OrderStatus.COMPLETED,
		image: "/images/orderImage.svg"
	},
	{
		id: "MEKO-SM_29000",
		product: "Bamboo Plantation",
		category: "Agriculture",
		customer: "Sustainable Forests",
		deliveryDate: "2023-04-10",
		status: OrderStatus.PENDING,
		image: "/images/orderImage.svg"
	},
	{
		id: "MEKO-SM_240024",
		product: "BioGas System",
		category: "Clean Cooking",
		customer: "EcoFuel Solutions",
		deliveryDate: "2023-03-25",
		status: OrderStatus.CANCELLED,
		image: "/images/orderImage.svg"
	},
	{
		id: "MEKO-SM_90007",
		product: "Solar Charger",
		category: "Electronics",
		customer: "Sunshine Tech",
		deliveryDate: "2023-04-12",
		status: OrderStatus.COMPLETED,
		image: "/images/orderImage.svg"
	}
];