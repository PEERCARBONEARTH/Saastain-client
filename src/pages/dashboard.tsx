import AppLayout from "@/layouts/AppLayout";
import { NextPageWithLayout } from "@/types/Layout";

const AppDashboard: NextPageWithLayout = () => {
	return <div>AppDashboard</div>;
};

AppDashboard.getLayout = (c) => <AppLayout>{c}</AppLayout>;

export default AppDashboard;
