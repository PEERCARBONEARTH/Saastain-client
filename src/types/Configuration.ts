import { ICompany } from "./Company";

type IDefaultModule = {
	[key: string]: { [key: string]: boolean };
};

type IUserModuleConfig = {
	[key: string]: { [key: string]: { [key: string]: boolean } };
};

export interface IConfiguration {
	id: string;
	createdAt: string;
	updatedAt: string;
	company: ICompany | null;
	modules: IDefaultModule;
	users: IUserModuleConfig;
}
