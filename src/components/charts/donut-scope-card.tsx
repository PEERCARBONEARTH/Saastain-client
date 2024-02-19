import { DonutChart, Legend } from '@tremor/react';

const sales = [
  {
    name: 'Scope 1',
    sales: 980,
  },
  {
    name: 'Scope 2',
    sales: 456,
  },
  {
    name: 'Scope 3',
    sales: 390,
  },
];

const valueFormatter = (number: number) =>
  `$ ${Intl.NumberFormat('us').format(number).toString()}`;

export function DonutScopeCard() {
  return (
    <>
      <div className="flex items-center justify-center space-x-6">
        <DonutChart
          data={sales}
          category="sales"
          index="name"
          valueFormatter={valueFormatter}
          colors={['blue', 'cyan', 'indigo']}
          className="w-40"
        />
        <Legend
          categories={['Scope 1', 'Scope 2', 'Scope 3']}
          colors={['blue', 'cyan', 'indigo']}
          className="max-w-xs"
        />
      </div>
    </>
  );
}