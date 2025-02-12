'use client';

import { FC } from 'react';
import { Card, CardBody, Button, Divider } from "@heroui/react";
import Link from "next/link";
import { HiOutlineInformationCircle } from 'react-icons/hi2';
import { IoIosArrowForward } from 'react-icons/io';

interface EmissionItemProps {
  label: string;
  value: string;
  showIcon?: boolean;
}

const EMISSION_ITEMS = [
  { label: "Travel", value: "10" },
  { label: "Energy", value: "0" },
  { label: "Waste", value: "0" },
  { label: "Food", value: "0" }
];

const EmissionItem: FC<EmissionItemProps> = ({ label, value, showIcon = true }) => (
  <div>
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-1">
        <span className="text-sm text-[#4B5563] font-normal">{label}</span>
        {showIcon && (
          <HiOutlineInformationCircle className="w-4 h-4 text-gray-400" />
        )}
      </div>
      <span className="text-sm font-medium">{value} tCo2e</span>
    </div>
    <Divider className="mt-4" />
  </div>
);

const Emissions: FC = () => {
  const totalEmissions = EMISSION_ITEMS.reduce((sum, item) => sum + parseFloat(item.value), 0);

  return (
    <Card className="bg-white">
      <CardBody className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold">Your Emissions</h3>
          <span className="text-xl font-semibold">{totalEmissions}</span>
          <span className="text-sm ml-1">tCo2e</span>
        </div>
        <div>
        <p className="text-xs font-light mb-2">Breakdowns</p>
          <div className="space-y-4">
            {EMISSION_ITEMS.map((item) => (
              <EmissionItem key={item.label} {...item} />
            ))}
          </div>
        </div>
        <Button 
          color="primary" 
          className="w-full mt-6"
          endContent={<IoIosArrowForward />}
        >
          Offset Emissions
        </Button>
        <Link 
          href="" 
          className="text-xs text-center mt-4 block hover:underline underline text-gray-500"
        >
          I agree to the terms and condition
        </Link>
      </CardBody>
    </Card>
  );
};

export default Emissions;