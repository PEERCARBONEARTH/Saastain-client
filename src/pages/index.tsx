import { AppEnumRoutes } from "@/types/AppEnumRoutes";
import { Button } from "@nextui-org/react";
import { useRouter } from "next/router";
import Login from "../pages/auth/login";

const index = () => {
	const router = useRouter();
	return (
		<div className="flex items-center h-screen justify-center">
			<Login />
			{/* <Button size="lg" onClick={() => router.push(AppEnumRoutes.APP_DASHBOARD)} color="primary">
				Go to Dashboard
			</Button> */}
		</div>
	);
};

export default index;
