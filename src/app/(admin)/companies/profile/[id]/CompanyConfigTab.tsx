import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import useConfigUtils from "@/hooks/useConfigUtils";
import { swrFetcher } from "@/lib/api-client";
import { IApiEndpoint } from "@/types/Api";
import { IConfiguration } from "@/types/Configuration";
import { Button, Card, CardBody, CardHeader, cn, Spinner, Switch, useDisclosure } from "@heroui/react";
import { FC, useState } from "react";
import toast from "react-hot-toast";
import useSWR from "swr";

interface ISubModuleItem {
	moduleName: string;
	subModuleName: string;
	config: IConfiguration;
	subModuleActiveStatus: boolean;
	onUpdate: VoidFunction;
	companyId: string;
}

const defaultModules = {
	Overview: {
		Dashboard: true,
	},
	Accounting: {
		"Add Data": true,
		"Data List": true,
	},
	Analytics: {
		"GHG Analytics": false,
		"ESG Reports": false,
	},
	ActionPlan: {
		"Net Zero": false,
		"My Projects": false,
	},
	GreenFinancing: {
		Marketplace: false,
		"Loan Requests": false,
	},
	Company: {
		Profile: true,
		Users: false,
		Notifications: false,
	},
};

function separatePascalCase(str: string): string {
	return str.replace(/([A-Z])/g, " $1").trim();
}

interface IProps {
	companyId: string;
}

interface InitCompanyConfigModalProps {
	companyId: string;
	onMutate?: VoidFunction;
}

const CompanyConfigTab: FC<IProps> = ({ companyId }) => {
	const { data: config, isLoading: loadingConfig, mutate: refetchConfig } = useSWR<IConfiguration>(!companyId ? null : [`${IApiEndpoint.GET_CONFIG_BY_COMPANY}/${companyId}`], swrFetcher, { keepPreviousData: true });
	return (
		<Card>
			<CardHeader>
				<div className="flex items-center justify-between w-full">
					<h1>Company Modules Access Configuration</h1>
					{!config && <InitCompanyConfigModal companyId={companyId} onMutate={refetchConfig} />}
				</div>
			</CardHeader>
			<CardBody>
				<div className="space-y-5">
					{loadingConfig && (
						<div className="h-96 flex items-center justify-center">
							<Spinner />
							<span className="ml-2">Loading Config...</span>
						</div>
					)}
					{config &&
						Object.entries(config?.modules).map(([moduleName, subModules], idx) => (
							<div className="space-y-2 mt-2 mb-4" key={idx}>
								<h1 className="font-semibold">{separatePascalCase(moduleName)}</h1>
								<div className="pl-2 grid grid-cols-1 md:grid-cols-2 gap-2">
									{Object.entries(subModules).map(([subModuleName, isActive]) => (
										<SubModuleItem moduleName={moduleName} subModuleName={subModuleName} config={config} subModuleActiveStatus={isActive} onUpdate={refetchConfig} companyId={companyId} />
									))}
								</div>
							</div>
						))}
				</div>
			</CardBody>
		</Card>
	);
};

const SubModuleItem = ({ moduleName, subModuleName, config, subModuleActiveStatus, companyId, onUpdate }: ISubModuleItem) => {
	const [value, setValue] = useState<boolean>(subModuleActiveStatus);

	const { updateSubModuleAccess } = useConfigUtils();

	const onChangeModuleAccess = async (val: boolean) => {
		setValue(val);
		const id = toast.loading("Updating Config ...");
		const info = {
			moduleName,
			subModuleName,
			isActive: val,
		};
		try {
			const resp = await updateSubModuleAccess(companyId, info);

			if (resp?.status === "success") {
				toast.success("Company Config Updated Successfully ...", { id });
				onUpdate();
			} else {
				toast.error("Unable to update company config.", { id });
			}
		} catch (err) {
			toast.error("Unable to update company config.", { id });
		}
	};

	return (
		<Switch
			isSelected={value}
			onValueChange={onChangeModuleAccess}
			isDisabled={defaultModules[moduleName][subModuleName]}
			classNames={{
				base: cn(
					"inline-flex flex-row-reverse w-full max-w-md bg-content1 hover:bg-content2 items-center",
					"justify-between cursor-pointer rounded-lg gap-2 p-4 border-2 border-transparent",
					"data-[selected=true]:border-primary"
				),
				wrapper: "p-0 h-4 overflow-visible",
				thumb: cn(
					"w-6 h-6 border-2 shadow-lg",
					"group-data-[hover=true]:border-primary",
					//selected
					"group-data-[selected=true]:ml-6",
					// pressed
					"group-data-[pressed=true]:w-7",
					"group-data-[selected]:group-data-[pressed]:ml-4"
				),
			}}>
			<div className="flex flex-col gap-1">
				<p className="text-medium">{subModuleName}</p>
				<p className="text-tiny text-default-400">
					Allow company to access <span className="font-semibold">{subModuleName}</span> Sub Module
				</p>
			</div>
		</Switch>
	);
};

const InitCompanyConfigModal: FC<InitCompanyConfigModalProps> = ({ companyId, onMutate }) => {
	const { isOpen, onClose, onOpenChange } = useDisclosure();
	const [loading, setLoading] = useState<boolean>(false);

	const { initCompanyConfig } = useConfigUtils();

	const onConfirm = async () => {
		setLoading(true);

		try {
			const resp = await initCompanyConfig(companyId);

			if (resp?.status === "success") {
				toast.success("Company Configuration Initialized Successfully ...");
				onMutate && onMutate?.();
				onClose();
			} else {
				toast.error(resp?.msg ?? "Unable to load configuration at the moment");
			}
		} catch (err) {
			toast.error("Unable to load configuration at the moment");
		} finally {
			setLoading(false);
		}
	};
	return (
		<AlertDialog open={isOpen} onOpenChange={onOpenChange}>
			<AlertDialogTrigger asChild>
				<Button color="primary">Setup Company Configuration</Button>
			</AlertDialogTrigger>
			<AlertDialogContent className="saastain font-nunito">
				<AlertDialogHeader>
					<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
					<AlertDialogDescription>This will load the configuration for this company.</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel asChild>
						<Button color="danger" size="sm" variant="flat">
							Cancel
						</Button>
					</AlertDialogCancel>
					<AlertDialogAction asChild>
						<Button size="sm" color="primary" onPress={onConfirm} isLoading={loading} isDisabled={loading}>
							Confirm
						</Button>
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
};

export default CompanyConfigTab;
