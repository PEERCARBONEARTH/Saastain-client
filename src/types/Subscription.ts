import { ICompany } from "./Company";

export enum SubscriptionStatus {
	ACTIVE = "active",
	INACTIVE = "inactive",
	CANCELLED = "cancelled",
	EXPIRED = "expired",
	PAST_DUE = "past-due",
	TRIALING = "trialing",
}

export enum BillingPeriod {
	MONTHLY = "monthly",
	QUARTERLY = "quarterly",
	ANNUAL = "annual",
}

export interface ISubscription {
	id: string;
	createdAt: string;
	updatedAt: string;
	company?: ICompany;
	stripeSubscriptionId?: string;
	stripePriceId?: string;
	stripeCustomerId?: string;
	stripeProductId?: string;
	status: SubscriptionStatus;
	billingPeriod: BillingPeriod;
	stripeMetadata?: Record<string, any>;
	cancelAtPeriodEnd?: boolean;
	startDate: string;
	endDate?: string;
	nextBillingDate?: string;
	lastBillingDate?: string;
	price: string;
	planName?: string;
}

export interface IStripeProductPrice {
	id: string;
	object: string;
	active: boolean;
	billing_scheme: string;
	created: number;
	currency: string;
	custom_unit_amount: number | null;
	livemode: boolean;
	lookup_key: string;
	metadata: Record<string, any>;
	nickname: string | null;
	product: IStripeProduct;
	recurring: Recurring;
	tax_behavior: string;
	tiers_mode: string | null;
	transform_quantity: string | null;
	type: string;
	unit_amount: number;
	unit_amount_decimal: string;
}

export interface IStripeProduct {
	id: string;
	object: string;
	active: boolean;
	attributes: any[];
	created: number;
	default_price: string | null;
	description: string | null;
	images: string[];
	livemode: boolean;
	marketing_features: any[];
	metadata: Record<string, any>;
	name: string;
	package_dimensions: any | null;
	shippable: boolean | null;
	statement_descriptor: string | null;
	tax_code: string | null;
	type: string;
	unit_label: string | null;
	updated: number;
	url: string | null;
}

interface Recurring {
	aggregate_usage: string | null;
	interval: string;
	interval_count: number;
	meter: string | null;
	trial_period_days: number | null;
	usage_type: string;
}
