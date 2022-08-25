import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import { fetchLaunchesByQuery } from '@/api/spacexApi';
import { SortField } from '@/types';

import { LaunchDetails } from './LaunchDetails';
import { LaunchSearchForm } from './LaunchSearchForm';
import { SortableTableHeader } from './SortableTableHeader';

export function LaunchesListingPage() {
  const [sortField, setSortField] = useState(SortField.DATE);
  const [sortAscending, setSortAscending] = useState(false);
  const [launchName, setLaunchName] = useState('');
  const { data, isLoading, isFetching } = useQuery(
    ['launches', sortField, sortAscending, launchName],
    () => fetchLaunchesByQuery({ offset: 0, limit: 50, sortField, sortAscending, launchName }),
    { keepPreviousData: true }
  );
  const hasLaunches = !!data?.docs?.length;
  const noResultsFound = !isLoading && !isFetching && !hasLaunches;
  const resultsFound = !isLoading && !isFetching && hasLaunches;
  return (
    <main className="p-8 mx-auto max-w-4xl space-y-8">
      <h1 className="text-2xl uppercase font-bold text-sky-400">SpaceX Launches</h1>
      <LaunchSearchForm setLaunchName={setLaunchName} />
      <p
        role="alert"
        aria-atomic
        aria-live="polite"
        className="italic text-sky-400 bg-slate-800 inline-block rounded-full px-4 py-2"
      >
        {(isLoading || isFetching) && 'Fetching results'}
        {noResultsFound && 'No results found'}
        {resultsFound && `${data.docs.length} ${data.docs.length === 1 ? 'result' : 'results'} found`}
      </p>
      {hasLaunches && (
        <table className="w-full">
          <caption className="sr-only">Launch search results, column headers with buttons are sortable.</caption>
          <thead className="bg-slate-800">
            <tr>
              <SortableTableHeader
                sortField={SortField.NAME}
                label="Name"
                currentSortField={sortField}
                currentSortAscending={sortAscending}
                setSortField={setSortField}
                setSortAscending={setSortAscending}
              />
              <SortableTableHeader
                sortField={SortField.DATE}
                label="Date"
                currentSortField={sortField}
                currentSortAscending={sortAscending}
                setSortField={setSortField}
                setSortAscending={setSortAscending}
              />
              <th />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-300">
            {data.docs.map(({ id, name, date_utc, details }) => (
              <tr key={id} data-testid={id}>
                <td className="p-4 w-1/3">{name ?? 'Unknown'}</td>
                <td className="p-4 w-1/3">{date_utc ?? 'Unknown'}</td>
                <td className="p-4 w-1/3">
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
