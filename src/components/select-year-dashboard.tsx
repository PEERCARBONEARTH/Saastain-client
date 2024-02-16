import React from "react";
import {Select, SelectItem} from "@nextui-org/react";
import {animals} from "../../dummy-data/data";

export default function SelectYear() {
  const placements = [
    "inside",
    "outside",
    "outside-left",
  ];

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="flex flex-col gap-2">
      <div className="flex w-full justify-end flex-wrap items-end md:flex-nowrap mb-6 md:mb-0 gap-4">
            <Select
                labelPlacement="outside"
                label="Choose a Year"
                placeholder="FY 2023"
                className="max-w-xs"
            >
                {animals.map((animal) => (
                <SelectItem key={animal.value} value={animal.value}>
                    {animal.label}
                </SelectItem>
                ))}
            </Select>
            </div>

      </div>  
    </div>  
  );
}
