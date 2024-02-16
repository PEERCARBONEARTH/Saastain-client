import BreadCrumb from "@/components/breadcrumbs";
import TabsDashboard from "@/components/tabs-dashboard";
import AppLayout from "@/layouts/AppLayout";
import { NextPageWithLayout } from "@/types/Layout";
import { Button, Card, CardBody, CardFooter, CardHeader, Divider, Spacer } from "@nextui-org/react";
import { MdAdd } from "react-icons/md";
import { FaRegSave } from "react-icons/fa";
import dynamic from "next/dynamic";
import { HiExternalLink } from "react-icons/hi";
import { HiOutlineArrowDownCircle, HiOutlineArrowUpCircle } from "react-icons/hi2";
import Head from "next/head";

const DonutChart = dynamic(() => import("@/components/charts/DonutChart"), { ssr: false });

const AppDashboard: NextPageWithLayout = () => {
	return <div>
		<BreadCrumb />
		<TabsDashboard/>
	</div>;
};

AppDashboard.getLayout = (c) => <AppLayout>{c}</AppLayout>;

export default AppDashboard;
