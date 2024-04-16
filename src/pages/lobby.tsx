import AuthLayout from "@/layouts/AuthLayout";
import { NextPageWithLayout } from "@/types/Layout";
import { Button } from "@nextui-org/react";
import Link from "next/link";

const AppLobby: NextPageWithLayout = () => {
	return (
		<div className="flex items-center justify-center h-screen">
			<div className="space-y-4">
				<h3 className="text-danger">Seems your account is not connected to any company, Please contact SaaStain support for assistance. </h3>
				<Button color="primary" as={Link} href="/auth/login">
					Back to Login
				</Button>
			</div>
		</div>
	);
};

AppLobby.getLayout = (c) => <AuthLayout>{c}</AuthLayout>;

export default AppLobby;
