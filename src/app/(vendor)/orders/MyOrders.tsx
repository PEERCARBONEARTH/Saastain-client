'use client';

import AppTable, { IAppTableColumn } from "@/components/table/AppTable";
import { Orders } from "@/data/orders";
import { AppEnumRoutes } from "@/types/AppEnumRoutes";
import { AppKey } from "@/types/Global";
import { OrderStatus, statusColors, statusTextColor } from "@/types/OrderStatus";
import { BreadcrumbItem, Breadcrumbs, Button, Chip, Link } from "@nextui-org/react";
import { useCallback } from "react";
import Image from "next/image";

interface IOrderItem {
	id: string;
	product: string;
	category: string;
  customer: string;
  deliveryDate: string;
  status: OrderStatus
}


const OrdersColumns: IAppTableColumn[] = [
	{
		name: "Order Id",
		uid: "id",
	},
	{
		name: "Product",
		uid: "product",
	},
	{
		name: "Category",
		uid: "category",
	},
	{
		name: "Customer",
		uid: "customer",
	},
	{
		name: "Delivery Date",
		uid: "deliveryDate",
	},
	{
		name: "Status",
		uid: "status",
	},
];

const MyOrders = () => {

  const renderCell = useCallback((item: IOrderItem, columnKey: AppKey) => {
		switch (columnKey) {
			case "id":
				return <p className="text-[#6B7280]">{item.id}</p>;
			case "product":
				return <p className="text-[#014737]">{item.product}</p>;
			case "category":
				return <Chip style={{ backgroundColor: '#EDEBFE', color: '#5521B5' }} >{item.category}</Chip>;
			case "customer":
				return <p>{item.customer}</p>;
			case "deliveryDate":
				return <p>{item.deliveryDate}</p>;
        case "status": {
          const backgroundColor = statusColors[item.status] || "#ccc"; 
          const textColor = statusTextColor[item.status] || "#ccc"
          return (
            <Chip style={{ backgroundColor, color: textColor }}>
              {item.status}
            </Chip>
          );
        }
			default:
				return null;
		}
	}, []);
  statusTextColor
  return (
    <>
    <Breadcrumbs>
      <BreadcrumbItem>Vendor</BreadcrumbItem>
      <BreadcrumbItem className="text-[#03543F]">My Orders</BreadcrumbItem>
    </Breadcrumbs>
    <div className="space-y-4 mt-8">
      <h1 className="font-bold text-2xl text-[#03543F]">My Orders</h1>
      <div className="w-full md:w-[80%]">
        <p>
        List of all current and past orders. You can view detailed information about each order, including the vendor name, order date, status, and total amount.
        </p>
        <hr className="mt-6 text-[#A7B3A7] border-[1px] w-[1137px]"  />
      </div>
    </div>

    <div className="mt-8">
				<AppTable<IOrderItem> headerColumns={OrdersColumns} data={Orders} count={Orders.length} isLoading={false} renderCell={renderCell} title="Orders">
        <a className="cursor-pointer flex flex-row">
      <Image src="/images/orderIcon.svg" alt= "" width={28} height={28}  className= "mr-1" /> 
      <Image src="/images/orderMenuIcon.svg" alt= "" width={28} height={28}  /> 
    </a>
				</AppTable>
			</div>
    </>
  )
}

export default MyOrders