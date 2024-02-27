import React from "react";
import {Select, SelectItem} from "@nextui-org/react";
import {years} from "../data/months";

export default function SelectYear() {

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="flex flex-col gap-2">
      <div className="flex w-full flex-wrap items-end md:flex-nowrap mb-6 md:mb-0 gap-4">
        
            <Select
                labelPlacement="outside"
                label="Choose a Year"
                placeholder="FY 2023"
                className="max-w-xs"
            >
                {years.map((year) => (
                <SelectItem key={year.value} value={year.value}>
                    {year.label}
                </SelectItem>
                ))}
            </Select>
            </div>

      </div>  
    </div>  
  );
}
