import { SortField } from '@/types';

import { Arrow } from './Arrow';

export interface SortableTableHeaderProps {
  sortField: SortField;
  label: string;
  currentSortField: SortField;
  sortAscending: boolean;
  setSortField: (value: SortField) => void;
  setSortAscending: (value: boolean) => void;
}

export function SortableTableHeader({
  sortField,
  label,
  currentSortField,
  sortAscending,
  setSortField,
  setSortAscending
}: SortableTableHeaderProps) {
  return (
    <th
      aria-sort={currentSortField === sortField ? (sortAscending ? 'ascending' : 'descending') : undefined}
      className="p-4 text-left font-bold"
    >
      <button
        className="hover:text-sky-500 flex items-center"
        onClick={() => {
          if (currentSortField !== sortField) {
            setSortField(sortField);
          } else {
            setSortAscending(!sortAscending);
          }
        }}
      >
        {label}
        {currentSortField === sortField && (
          <Arrow className={`text-lg text-sky-500 inline ml-2 ${sortAscending ? 'rotate-180' : 'rotate-0'}`} />
        )}
      </button>
    </th>
  );
}
