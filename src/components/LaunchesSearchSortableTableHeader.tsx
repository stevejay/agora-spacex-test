import { SortField } from '@/types';

import { Arrow } from './Arrow';

export interface LaunchesSearchSortableTableHeaderProps {
  sortField: SortField;
  label: string;
  currentSortField: SortField;
  sortAscending: boolean;
  setSortField: (value: SortField) => void;
  setSortAscending: (value: boolean) => void;
}

export function LaunchesSearchSortableTableHeader({
  sortField,
  label,
  currentSortField,
  sortAscending,
  setSortField,
  setSortAscending
}: LaunchesSearchSortableTableHeaderProps) {
  const isCurrentlySorting = currentSortField === sortField;
  return (
    <th
      scope="col"
      aria-sort={isCurrentlySorting ? (sortAscending ? 'ascending' : 'descending') : 'none'}
      className="p-4 text-left font-bold"
    >
      <button
        className="hover:text-sky-500 flex items-center"
        onClick={() => {
          if (isCurrentlySorting) {
            setSortAscending(!sortAscending);
          } else {
            setSortField(sortField);
          }
        }}
      >
        {label}
        {isCurrentlySorting && (
          <Arrow className={`text-lg text-sky-500 inline ml-2 ${sortAscending ? 'rotate-180' : 'rotate-0'}`} />
        )}
      </button>
    </th>
  );
}
