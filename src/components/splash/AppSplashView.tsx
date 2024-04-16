import { useSplashStore } from "@/hooks/store/useSplashStore";
import { Spinner } from "@nextui-org/react";
import { FC, useMemo } from "react";

interface AppSplashViewProps {
	forceShow?: boolean;
}

const AppSplashView: FC<AppSplashViewProps> = ({ forceShow = false }) => {
	const { show } = useSplashStore();
	return useMemo(() => {
		if (show || forceShow) {
			return (
				<div className="fixed z-[1000] w-full p-4 h-full max-w-full top-0 left-0 flex flex-col bg-white justify-center items-center select-none">
					<img src="/images/logo1.png" width={120} className="mx-auto" />
					<div className="mt-8 mb-8">
						<Spinner size="lg" color="primary" />
					</div>
					<p className="text-center font-bold text-primary text-2xl">Please Wait</p>
				</div>
			);
		}

		return null;
	}, [forceShow, show]);
};

export default AppSplashView;
