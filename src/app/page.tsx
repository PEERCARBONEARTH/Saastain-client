import { nextAuthOptions } from "@/lib/next-auth-options";
import { AppEnumRoutes } from "@/types/AppEnumRoutes";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function page() {
    const session = await getServerSession(nextAuthOptions);

    if(!session?.user){
        redirect(AppEnumRoutes.AUTH_LOGIN)
    }

    const account = session?.user

    if(!account.isOnboardingComplete){
        redirect(AppEnumRoutes.APP_ONBOARDING_COMPANY)
    }

    redirect(AppEnumRoutes.APP_DASHBOARD)
}
