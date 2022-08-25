import { SortField } from '@/types';

export interface SortableTableHeaderProps {
  sortField: SortField;
  label: string;
  currentSortField: SortField;
  currentSortAscending: boolean;
  setSortField: (value: SortField) => void;
  setSortAscending: (value: boolean) => void;
}

export function SortableTableHeader({
  sortField,
  label,
  currentSortField,
  currentSortAscending,
  setSortField,
  setSortAscending
}: SortableTableHeaderProps) {
  return (
    <th
      aria-sort={currentSortField === sortField ? (currentSortAscending ? 'ascending' : 'descending') : undefined}
      className="p-4 text-left font-bold"
    >
      <button
        onClick={() => {
          if (currentSortField !== sortField) {
            setSortField(sortField);
          } else {
            setSortAscending(!currentSortAscending);
          }
        }}
      >
        {label} {currentSortField === sortField ? (currentSortAscending ? ' 🔼' : ' 🔽') : ''}
      </button>
    </th>
  );
}
