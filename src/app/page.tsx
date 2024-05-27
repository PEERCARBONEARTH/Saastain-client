import { nextAuthOptions } from "@/lib/next-auth-options";
import { AppEnumRoutes } from "@/types/AppEnumRoutes";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function page() {
    const session = await getServerSession(nextAuthOptions);

    if(!session?.user){
        redirect(AppEnumRoutes.AUTH_LOGIN)
    }

    redirect(AppEnumRoutes.APP_DASHBOARD)
}
