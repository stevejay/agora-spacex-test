import { useQuery } from '@tanstack/react-query';

import { fetchLaunchesByQuery } from '@/api/spacexApi';
import { useLaunchesSearch } from '@/hooks/useLaunchesSearch';
import { SortField } from '@/types';

import { LaunchDetails } from './LaunchDetails';
import { LaunchesSearchForm } from './LaunchesSearchForm';
import { LaunchesSearchSortableTableHeader } from './LaunchesSearchSortableTableHeader';
import { SearchStatus } from './SearchStatus';

export function LaunchesSearchPage() {
  const { sortField, setSortField, sortAscending, setSortAscending, launchName, setLaunchName, resetLaunchesSearch } =
    useLaunchesSearch();
  const { data, isLoading, isFetching } = useQuery(
    ['launches', sortField, sortAscending, launchName],
    () => fetchLaunchesByQuery({ offset: 0, limit: 50, sortField, sortAscending, launchName }),
    { keepPreviousData: true }
  );
  const hasLaunches = !!data?.docs?.length;
  return (
    <main className="p-8 mx-auto max-w-4xl space-y-8">
      <h1 className="text-2xl uppercase font-bold text-sky-400">SpaceX Launches</h1>
      <LaunchesSearchForm
        launchName={launchName}
        setLaunchName={setLaunchName}
        clearSearchParams={resetLaunchesSearch}
      />
      <SearchStatus
        hasSearchTerm={!!launchName}
        resultsCount={data?.docs?.length ?? 0}
        isFetching={isLoading || isFetching}
      />
      {hasLaunches && (
        <table className="w-full">
          <caption className="sr-only">Launch search results, column headers with buttons are sortable.</caption>
          <thead className="bg-slate-800">
            <tr>
              <LaunchesSearchSortableTableHeader
                sortField={SortField.NAME}
                label="Name"
                currentSortField={sortField}
                sortAscending={sortAscending}
                setSortField={setSortField}
                setSortAscending={setSortAscending}
              />
              <LaunchesSearchSortableTableHeader
                sortField={SortField.DATE}
                label="Date"
                currentSortField={sortField}
                sortAscending={sortAscending}
                setSortField={setSortField}
                setSortAscending={setSortAscending}
              />
              <th />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-300">
            {data.docs.map(({ id, name, date_utc, details }) => (
              <tr key={id} data-testid={id}>
                <td scope="row" className="p-4 w-1/3">
                  {name ?? 'Unknown'}
                </td>
                <td className="p-4 w-1/3">{new Date(date_utc).toUTCString() ?? 'Unknown'}</td>
                <td className="p-4 w-1/3 text-right">
                  <LaunchDetails details={details} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}
