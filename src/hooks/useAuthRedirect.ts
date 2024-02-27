import { useSession } from "next-auth/react";

const useAuthRedirect = () => {
	const { data: session, status } = useSession();

	if (status === "loading") return false;

	if (session?.user) {
		return true;
	}

	return false;
};

export default useAuthRedirect;
