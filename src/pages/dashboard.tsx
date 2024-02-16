import BreadCrumb from "@/components/breadcrumbs";
import TabsDashboard from "@/components/tabs-dashboard";
import AppLayout from "@/layouts/AppLayout";
import { NextPageWithLayout } from "@/types/Layout";

const AppDashboard: NextPageWithLayout = () => {
	return <div>
		<BreadCrumb />
		<TabsDashboard/>
	</div>;
};

AppDashboard.getLayout = (c) => <AppLayout>{c}</AppLayout>;

export default AppDashboard;
