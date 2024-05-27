import { AppEnumRoutes } from "@/types/AppEnumRoutes";
import { redirect } from "next/navigation";

const page = () => {
	redirect(AppEnumRoutes.AUTH_LOGIN);
};

export default page;
