"use client";
import AppCheckbox from "@/components/forms/AppCheckbox";
import AppInput from "@/components/forms/AppInput";
import { Button, Spacer } from "@heroui/react";
import Image from "next/image";
import Link from "next/link";
import { HiArrowNarrowRight } from "react-icons/hi";

const Login = () => {
	return (
		<div className="grid grid-cols-1 md:grid-cols-5 bg-[#133726]">
			<div className="col-auto md:col-span-2 h-screen bg-white md:rounded-r-2xl">
				<div className="flex flex-col justify-center h-full px-3 md:px-10">
					<Image src="/images/saastain_logo.svg" alt="SaaStain Logo" width={150} height={40} className="mb-8" />
					<div className="space-y-2">
						<h1 className="text-2xl font-bold text-[#2D3748]">Get Started With Saastain</h1>
						<p className="text-[#718096]">Fill the details below to create an account</p>
					</div>
					<div className="mt-4">
						<AppInput label={"Name"} placeholder="Your Full Name" labelPlacement="inside" />
						<Spacer y={4} />
						<AppInput label="Email Address" placeholder="Email" type="email" labelPlacement="inside" />
						<Spacer y={4} />
						<AppInput label={"Role in Company"} placeholder="Your role in company" labelPlacement="inside" />
						<Spacer y={4} />
						<AppInput label="Password" placeholder="Password" type="password" labelPlacement="inside" isPassword />
						<Spacer y={4} />
						<AppInput label="Confirm Password" placeholder="Confirm Password" labelPlacement="inside" type="password" isPassword />
						<Spacer y={4} />
						<AppCheckbox
							label={
								<div>
									I agree to our{" "}
									<Link href={"/terms"} target="_blank" className="underline underline-offset-4">
										Terms & Conditions
									</Link>
								</div>
							}
						/>
						<Spacer y={4} />
						<Button color="primary" className="bg-[#22614A]" endContent={<HiArrowNarrowRight className="w-5 h-5" />} fullWidth>
							Sign Up
						</Button>
						<Spacer y={4} />
						<div className="flex items-center justify-center gap-2">
							<p className="text-sm text-gray-600">Already have an account?</p>
							<Button as={Link} href={`/auth/login`} variant="bordered">
								Login
							</Button>
						</div>
					</div>
				</div>
			</div>
			<div className="hidden md:block md:col-span-3 h-screen px-6 py-10">
				<img src="/images/Onboarding-bg.png" alt="" className="h-full w-full object-cover" />
			</div>
		</div>
	);
};

export default Login;
