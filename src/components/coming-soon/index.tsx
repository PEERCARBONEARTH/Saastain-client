import { Button } from "@heroui/react";
import Image from "next/image";

const ComingSoon = () => {
	return (
		<div className="h-screen w-full flex items-center justify-center">
			<div className="bg-white rounded-xl shadow-lg">
				<div className="grid grid-col-1 md:grid-cols-2 gap-5 py-6 px-4">
					<div className="flex flex-col h-full justify-center space-y-6 px-6">
						<h1 className="text-[#A7B3A7] uppercase text-xl font-bold">Coming Soon</h1>
						<h3 className="text-2xl font-bold">Get notified when we launch</h3>
						<p className="text-[#374151] text-lg">This page is currently under construction. Be the first to experience it! Join the waiting list for exclusive access.</p>
						<div>
							<Button color="primary">Notify Me</Button>
						</div>
					</div>
					<Image src="/images/coming-soon.png" alt="Coming Soon" width={600} height={600} />
				</div>
			</div>
		</div>
	);
};

export default ComingSoon;
