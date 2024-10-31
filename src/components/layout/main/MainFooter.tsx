import { FaLinkedinIn } from "react-icons/fa6";
import { RiFacebookFill, RiTwitterXFill } from "react-icons/ri";

const MainFooter = () => {
	return (
		<div className="mt-5 border-t py-10 items-center justify-between sm:flex">
			<p className="text-gray-800">&copy; {new Date().getFullYear()} Peercarbon. All rights reserved </p>
			<div className="flex items-center gap-x-6 text-gray-400 mt-6">
				<RiFacebookFill className="text-gray-800 w-6 h-6" />
				<RiTwitterXFill className="text-gray-800 w-6 h-6" />
				<FaLinkedinIn className="text-gray-800 w-6 h-6" />
			</div>
		</div>
	);
};
export default MainFooter;
