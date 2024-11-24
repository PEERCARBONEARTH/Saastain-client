export enum EmailTemplateStatus {
	DRAFT = "draft",
	ACTIVE = "active",
	INACTIVE = "inactive",
	ARCHIVED = "archived",
	DELETED = "deleted",
}

export interface IEmailTemplate {
	id: string;
	createdAt: string;
	updatedAt: string;
	title: string;
	description?: string;
	subject: string;
	content: string;
	tags: string[];
	status: EmailTemplateStatus;
}
