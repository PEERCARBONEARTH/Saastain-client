export interface LoginFormValues {
	email: string;
	password: string;
}

export interface IOption {
	value?: string;
	label: string;
}

export interface CreateCompanyFormValues {
	companyName: string;
	primaryEmail: string;
	phoneNo: string;
	location: string;
	description: string;
	userId: string
}
