"use client";

import AppImage from "@/components/images/AppImage";
import { Accordion, AccordionItem, BreadcrumbItem, Breadcrumbs, Button, Card, CardBody, CardFooter, CardHeader, Chip, Link } from "@nextui-org/react";
import Image from "next/image";
import { FaClock } from "react-icons/fa";
import { FiEdit3 } from "react-icons/fi";

interface IProps {
	id: string;
}

export default function ProductDetails({ id }: IProps) {
	return (
		<>
			<Breadcrumbs>
				<BreadcrumbItem>Vendor</BreadcrumbItem>
				<BreadcrumbItem>Product Details</BreadcrumbItem>
			</Breadcrumbs>
			<div className="grid grid-cols-1  md:grid-cols-12 gap-2 mt-7">
				<div className="my-6 col-auto md:col-span-8">
					<Chip endContent={<FaClock size={18} />} color="primary" variant="flat">
						{"Clean Cooking"}
					</Chip>
					<h1 className="text-2xl font-bold mt-2">Meko Friendly Cooking Stove</h1>
					<p className="leading my-4">
						We are the only manufactures of MEKO FRIENDLY steam cooking system in Africa, the system is patented and has the Kenya bureau standard mark of quality, Our system accelerates the cooking speed
						with low energy cost, high performance and without burning or scorching, in most hygienic way.
						<br /> <br />
						It helps make solid and liquid meals, in bulk with equal ease. Extra heavy acid proof, food grade stainless steel quality cooking vessels perfectly designed with a tilting mechanism and all safety
						devices like pressure gauge, steam trap and pressure release valves all incorporated for the ease and safety of the users of our equipment.
					</p>
					<h5 className="text-lg font-bold mt-4 mb-2">SDG Impact</h5>
					<div className="flex justify-start items-center gap-3 flex-wrap">
						<Image alt="SDG 1" src="/images/sdg-pics/SDG-1.png" width={50} height={50} />
						<Image alt="SDG 1" src="/images/sdg-pics/SDG-3.png" width={50} height={50} />
						<Image alt="SDG 1" src="/images/sdg-pics/SDG-4.png" width={50} height={50} />
						<Image alt="SDG 1" src="/images/sdg-pics/SDG-5.png" width={50} height={50} />
						<Image alt="SDG 1" src="/images/sdg-pics/SDG-7.png" width={50} height={50} />
						<Image alt="SDG 1" src="/images/sdg-pics/SDG-8.png" width={50} height={50} />
						<Image alt="SDG 1" src="/images/sdg-pics/SDG-13.png" width={50} height={50} />
						<Image alt="SDG 1" src="/images/sdg-pics/SDG-15.png" width={50} height={50} />
					</div>
					<div className="">
						<h5 className="text-lg font-bold mt-4 mb-2">Summary Details</h5>
						<Accordion>
							<AccordionItem
								title="What it does?"
								classNames={{
									heading: "bg-gray-200 rounded-t-md  px-2 text-base  font-semibold my-2",
									title: "text-[16px]",
								}}>
								<p className="leading my-4">
									The system comes in different capacities ranging from, 50 to 100 persons to 2000 to 2500 persons, Meal can be prepared in either non jacketed and jacketed vessels / pots. The steam
									generator uses different types of fuels available locally either LPG gas, firewood, briquette, diesel, used oil or coconut husks. Each of this fuel source has a special burner or
									burning chamber that comes with the convenience, the system comes with one by default. We can manufacture as per your unique requirement as well. The system prepares all types of meals
									including POSHO (UGALI).
								</p>
								<p className="leading my-4">
									Our Cooking system retains the texture & shape of the cooked food. The Food cannot get over cooked, No Possibility. In conventional cooking system 4 fire Points are required to cook 4
									items / pots whereas in our innovative steam cooking system 1 fire point cooks all the 4 pots/ vessels with 1 fire point / source of heat.
								</p>
								<p className="leading my-4">Saving on time and energy. This is suitable for Institutions and places where large food preparation is done, for those who mean business.</p>
							</AccordionItem>
							<AccordionItem
								title="Advantages of this product?"
								classNames={{
									heading: "bg-gray-200 rounded-t-md  px-2 text-base  font-semibold my-2",
									title: "text-[16px]",
								}}>
								<p className="leading my-4">
									The system comes in different capacities ranging from, 50 to 100 persons to 2000 to 2500 persons, Meal can be prepared in either non jacketed and jacketed vessels / pots. The steam
									generator uses different types of fuels available locally either LPG gas, firewood, briquette, diesel, used oil or coconut husks. Each of this fuel source has a special burner or
									burning chamber that comes with the convenience, the system comes with one by default. We can manufacture as per your unique requirement as well. The system prepares all types of meals
									including POSHO (UGALI).
								</p>
								<p className="leading my-4">
									Our Cooking system retains the texture & shape of the cooked food. The Food cannot get over cooked, No Possibility. In conventional cooking system 4 fire Points are required to cook 4
									items / pots whereas in our innovative steam cooking system 1 fire point cooks all the 4 pots/ vessels with 1 fire point / source of heat.
								</p>
								<p className="leading my-4">Saving on time and energy. This is suitable for Institutions and places where large food preparation is done, for those who mean business.</p>
							</AccordionItem>
							<AccordionItem
								title="Challenges"
								classNames={{
									heading: "bg-gray-200 rounded-t-md  px-2 text-base  font-semibold my-2",
									title: "text-[16px]",
								}}>
								<p className="leading my-4">
									The system comes in different capacities ranging from, 50 to 100 persons to 2000 to 2500 persons, Meal can be prepared in either non jacketed and jacketed vessels / pots. The steam
									generator uses different types of fuels available locally either LPG gas, firewood, briquette, diesel, used oil or coconut husks. Each of this fuel source has a special burner or
									burning chamber that comes with the convenience, the system comes with one by default. We can manufacture as per your unique requirement as well. The system prepares all types of meals
									including POSHO (UGALI).
								</p>
								<p className="leading my-4">
									Our Cooking system retains the texture & shape of the cooked food. The Food cannot get over cooked, No Possibility. In conventional cooking system 4 fire Points are required to cook 4
									items / pots whereas in our innovative steam cooking system 1 fire point cooks all the 4 pots/ vessels with 1 fire point / source of heat.
								</p>
								<p className="leading my-4">Saving on time and energy. This is suitable for Institutions and places where large food preparation is done, for those who mean business.</p>
							</AccordionItem>
						</Accordion>
					</div>
					<div className="grid grid-cols-1 md:grid-cols-12  gap-2">
						<div className="col-auto md:col-span-8">
							<AppImage
								alt={"project.project_name"}
								radius="sm"
								src={"/images/jiko.jpg"}
								classNames={{
									img: "w-full  opacity-1",
								}}
								width={500}
								height={500}
							/>
						</div>

						<div className="col-auto md:col-span-3  gap-10">
							<div className="grid grid-col-2 gap-4 h-full">
								<AppImage
									alt={"project.project_name"}
									radius="sm"
									src={"/images/jiko.jpg"}
									classNames={{
										img: "w-full h-full  opacity-1",
									}}
									width={250}
									height={250}
								/>
								<AppImage
									alt={"project.project_name"}
									radius="sm"
									src={"/images/jiko.jpg"}
									classNames={{
										img: "w-full h-full  opacity-1",
									}}
									width={250}
									height={250}
								/>
							</div>
						</div>
					</div>
				</div>
				<div className="order-first md:order-last  col-auto md:col-span-4 mt-5 md:mt-0">
					<Card className="space-x-2 px-4 py-4 w-full ">
						<CardHeader>
							<h2 className="font-semibold  text-xl">Product Summary</h2>
						</CardHeader>
						<CardBody className="space-y-4">
							<p className="flex flex-col text-base">
								<span className="font-semibold">Product name :</span>
								<span className="text-gray-400 text-sm">{"Meko Friendly Cooking Stove"}</span>
							</p>
							<p className="flex flex-col text-base">
								<span className="font-semibold">Industry :</span>
								<span className="text-gray-400 text-sm">{"Clean Cooking"}</span>
							</p>
							<p className="flex flex-col text-base">
								<span className="font-semibold">SDG Impact :</span>
								<span className="text-gray-400 text-sm">{"1, 4, 7, 8, 11"}</span>
							</p>
							<p className="flex flex-col text-base">
								<span className="font-semibold">Price Range :</span>
								<span className="text-gray-400 text-sm">{"KSH 10000000 - 200000000"}</span>
							</p>
						</CardBody>
						<CardFooter>
							<Button color="primary" variant="solid" as={Link} href={"/"} endContent={<FiEdit3 />} className="w-full">
								Edit
							</Button>
						</CardFooter>
					</Card>
				</div>
			</div>
		</>
	);
}
