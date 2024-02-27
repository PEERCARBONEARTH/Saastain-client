import React from "react";
import { Select, SelectItem } from "@nextui-org/react";
import { branches } from "../data/months";

export default function SelectBranch() {
  return (
    <div className="w-full">
      <div className="flex flex-col gap-2">
        <div className="flex w-full flex-wrap items-end md:flex-nowrap mb-6 md:mb-0 gap-4">
          <Select
            labelPlacement="outside"
            label="Choose a Branch"
            placeholder="Main Branch"
            className="max-w-xs"
          >
            {branches.map((branch) => (
              <SelectItem key={branch.value} value={branch.value}>
                {branch.label}
              </SelectItem>
            ))}
          </Select>
        </div>
      </div>
    </div>
  );
}
