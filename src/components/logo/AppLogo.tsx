import Image from "next/image";
import Link from "next/link";

const AppLogo = () => {
	return (
		<Link href={"/"}>
			<Image src={"/images/logo1.png"} width={120} height={50} alt="App Logo" />
		</Link>
	);
};

export default AppLogo;
