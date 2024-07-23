import { AppEnumRoutes } from "@/types/AppEnumRoutes";
import { redirect } from "next/navigation";

export default function page() {
	redirect(AppEnumRoutes.APP_COMPANY);
}
