import AppTable, { IAppTableColumn } from "@/components/table/AppTable";
import { AppKey } from "@/types/Global";
import { Button } from "@nextui-org/react";
import { Trash2 } from "lucide-react";
import { useCallback } from "react";
import { FiEdit3 } from "react-icons/fi";
import NewEmailTemplateModal from "./NewEmailTemplateModal";
import { IEmailTemplate } from "@/types/Template";
import useSWR from "swr";
import { IApiEndpoint } from "@/types/Api";
import { swrFetcher } from "@/lib/api-client";
import EditEmailTemplateModal from "./EditEmailTemplateModal";

const columns: IAppTableColumn[] = [
	{
		name: "Template Name",
		uid: "title",
	},
	{
		name: "Subject",
		uid: "subject",
	},
	{
		name: "Description",
		uid: "description",
	},
	{
		name: "Actions",
		uid: "actions",
	},
];

const EmailTemplatesTab = () => {
	const { data, isLoading, mutate } = useSWR<IEmailTemplate[]>([IApiEndpoint.GET_ALL_EMAIL_TEMPLATES], swrFetcher, { keepPreviousData: true });

	const renderCell = useCallback((item: IEmailTemplate, columnKey: AppKey) => {
		switch (columnKey) {
			case "title":
				return <span>{item.title}</span>;

			case "subject":
				return <span>{item.subject}</span>;

			case "description":
				return <span>{item.description}</span>;

			case "actions":
				return (
					<div className="flex items-center gap-3">
						<EditEmailTemplateModal selectedTemplateId={item?.id} mutate={mutate} />
						<Button isIconOnly color="danger" variant="light">
							<Trash2 className="w-5 h-5" />
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
				<h1 className="text-xl font-bold text-green-900">Email Templates</h1>
				<p className="text-[#6B7280]">iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati</p>
			</div>
			<div className="my-5">
				<AppTable<IEmailTemplate> title={"Email Templates"} data={data ?? []} headerColumns={columns} count={data?.length ?? 0} isLoading={isLoading} renderCell={renderCell}>
					<NewEmailTemplateModal mutate={mutate} />
				</AppTable>
			</div>
		</>
	);
};

export default EmailTemplatesTab;
