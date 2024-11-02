import { StationaryCombustionAddVariant } from "@/types/Appliances";
import { FugitiveAddVariant, ProcessingEmissionAddVariant } from "@/types/ProcessingAndFugitive";

enum TFleetVariant {
	DELIVERY_VEHICLES = "delivery-vehicles",
	PASSENGER_VEHICLES = "passenger-vehicles",
}

type TAccountingDataKeyType = TFleetVariant | FugitiveAddVariant | ProcessingEmissionAddVariant | StationaryCombustionAddVariant;

type TMapKeyValue = Record<TAccountingDataKeyType, string>;

export const mapAccountingVariantsToNames = {
	[TFleetVariant.DELIVERY_VEHICLES]: "Delivery Vehicles",
	[TFleetVariant.PASSENGER_VEHICLES]: "Passenger Vehicles",
	[FugitiveAddVariant.AIR_CONDITIONING_SYSTEMS]: "Air Conditioning Systems",
	[FugitiveAddVariant.LEAK_DETECTION]: "Leak Detection & Repair",
	[FugitiveAddVariant.REFRIGERATION_UNITS]: "Refrigeration Units",
	[ProcessingEmissionAddVariant.CHEMICAL_REACTIONS]: "Chemical Reactions",
	[ProcessingEmissionAddVariant.INDUSTRIAL_EQUIPMENTS]: "Industrial Equipments",
	[StationaryCombustionAddVariant.BOILERS_FURNACES]: "Boilers & Furnaces",
	[StationaryCombustionAddVariant.GENERATORS]: "Generators",
	[StationaryCombustionAddVariant.HEATER]: "Heater",
	[StationaryCombustionAddVariant.KITCHEN_APPLIANCES]: "Kitchen Appliances",
} satisfies TMapKeyValue;
