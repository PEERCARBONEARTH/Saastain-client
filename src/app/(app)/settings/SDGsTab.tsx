import AddNewSDGItemModal from "@/components/modals/AddNewSDGItemModal";
import AppTable, { IAppTableColumn } from "@/components/table/AppTable";
import { AppKey } from "@/types/Global";
import { ISDG } from "@/types/SDG";
import { Button } from "@nextui-org/react";
import Image from "next/image";
import { useCallback } from "react";

const SDGs: ISDG[] = [
	{ id: "1", imgUrl: "/images/sdgs/SDG-1 1.png", title: "No Poverty", description: "End poverty in all its forms everywhere." },
	{ id: "2", imgUrl: "/images/sdgs/SDG-1 1.png", title: "Zero Hunger", description: "End hunger, achieve food security and improved nutrition, and promote sustainable agriculture." },
	{ id: "3", imgUrl: "/images/sdgs/SDG-1 1.png", title: "Good Health and Well-being", description: "Ensure healthy lives and promote well-being for all at all ages." },
	{ id: "4", imgUrl: "/images/sdgs/SDG-1 1.png", title: "Quality Education", description: "Ensure inclusive and equitable quality education and promote lifelong learning opportunities for all." },
	{ id: "5", imgUrl: "/images/sdgs/SDG-1 1.png", title: "Gender Equality", description: "Achieve gender equality and empower all women and girls." },
	{ id: "6", imgUrl: "/images/sdgs/SDG-1 1.png", title: "Clean Water and Sanitation", description: "Ensure availability and sustainable management of water and sanitation for all." },
	{ id: "7", imgUrl: "/images/sdgs/SDG-1 1.png", title: "Affordable and Clean Energy", description: "Ensure access to affordable, reliable, sustainable, and modern energy for all." },
	{
		id: "8",
		imgUrl: "/images/sdgs/SDG-1 1.png",
		title: "Decent Work and Economic Growth",
		description: "Promote sustained, inclusive and sustainable economic growth, full and productive employment and decent work for all.",
	},
	{
		id: "9",
		imgUrl: "/images/sdgs/SDG-1 1.png",
		title: "Industry, Innovation, and Infrastructure",
		description: "Build resilient infrastructure, promote inclusive and sustainable industrialization, and foster innovation.",
	},
	{ id: "10", imgUrl: "/images/sdgs/SDG-1 1.png", title: "Reduced Inequality", description: "Reduce inequality within and among countries." },
	{ id: "11", imgUrl: "/images/sdgs/SDG-1 1.png", title: "Sustainable Cities and Communities", description: "Make cities and human settlements inclusive, safe, resilient, and sustainable." },
	{ id: "12", imgUrl: "/images/sdgs/SDG-1 1.png", title: "Responsible Consumption and Production", description: "Ensure sustainable consumption and production patterns." },
	{ id: "13", imgUrl: "/images/sdgs/SDG-1 1.png", title: "Climate Action", description: "Take urgent action to combat climate change and its impacts." },
	{ id: "14", imgUrl: "/images/sdgs/SDG-1 1.png", title: "Life Below Water", description: "Conserve and sustainably use the oceans, seas and marine resources for sustainable development." },
	{
		id: "15",
		imgUrl: "/images/sdgs/SDG-1 1.png",
		title: "Life on Land",
		description: "Protect, restore and promote sustainable use of terrestrial ecosystems, manage forests, combat desertification, and halt and reverse land degradation and halt biodiversity loss.",
	},
	{
		id: "16",
		imgUrl: "/images/sdgs/SDG-1 1.png",
		title: "Peace, Justice, and Strong Institutions",
		description: "Promote peaceful and inclusive societies for sustainable development, provide access to justice for all and build effective, accountable and inclusive institutions at all levels.",
	},
	{ id: "17", imgUrl: "/images/sdgs/SDG-1 1.png", title: "Partnerships for the Goals", description: "Strengthen the means of implementation and revitalize the Global Partnership for Sustainable Development." },
];

const columns: IAppTableColumn[] = [
	{
		name: "SDGs",
		uid: "title",
	},
	{
		name: "Actions",
		uid: "actions",
	},
];

const SDGsTab = () => {
	const renderCell = useCallback((item: ISDG, columnKey: AppKey) => {
		switch (columnKey) {
			case "title":
				return (
					<div className="flex items-center gap-2">
						<Image src={item.imgUrl} alt="Img Url" width={60} height={60} />
						<div className="space-y-2">
							<h2 className="text-lg font-semibold" >{item.title}</h2>
							<p className="text-gray-600" >{item.description}</p>
						</div>
					</div>
				);
			case "actions":
				return (
					<div className="flex items-center gap-3">
						<Button color="primary" size="sm" variant="flat">
							Edit
						</Button>
						<Button color="danger" size="sm" variant="flat">
							Delete
						</Button>
					</div>
				);
			default:
				return null;
		}
	}, []);
	return (
		<>
			<div className="space-y-3 pb-3 border-b-1.5 border-[#A7B3A7]">
				<h1 className="text-xl font-bold text-green-900">Sustainable Development Goals</h1>
				<p className="text-[#6B7280]">iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati</p>
			</div>
            <div className="my-5">
				<AppTable<ISDG>
					title={"Green Categories"}
					data={SDGs}
					headerColumns={columns}
					renderCell={renderCell}
					count={SDGs.length}
					showBottomContent={false}
					isLoading={false}>
					<AddNewSDGItemModal />
				</AppTable>
			</div>
		</>
	);
};

export default SDGsTab;
