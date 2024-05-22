import { auth } from "@/lib/auth";
import { AppEnumRoutes } from "@/types/AppEnumRoutes";
import { redirect } from "next/navigation";

export default async function page() {
    const session = await auth();

    if(!session.user){
        redirect(AppEnumRoutes.AUTH_LOGIN)
    }

    redirect(AppEnumRoutes.APP_DASHBOARD)
}
