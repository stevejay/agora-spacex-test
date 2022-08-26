import { useState } from 'react';
import { FetchStatus, useQuery } from '@tanstack/react-query';

import { fetchLaunchesByQuery } from '@/api/spacexApi';
import { SortField } from '@/types';

import { LaunchDetails } from './LaunchDetails';
import { LaunchesSearchForm } from './LaunchesSearchForm';
import { SortableTableHeader } from './SortableTableHeader';

function getAlertText(isLoading: boolean, isFetching: boolean, fetchStatus: FetchStatus, resultsCount: number) {
  const hasLaunches = Boolean(resultsCount);
  const noResultsFound = !isLoading && !isFetching && !hasLaunches;
  const resultsFound = !isLoading && !isFetching && hasLaunches;
  if ((isLoading || isFetching) && fetchStatus !== 'idle') {
    return 'Fetching results';
  }
  if (noResultsFound) {
    return 'No results found';
  }
  if (resultsFound) {
    return `${resultsCount} ${resultsCount === 1 ? 'result' : 'results'} returned`;
  }
  // TODO The behaviour of react-query changed with v4 regarding a disabled query
  // and the fetch status. The devs may come up with a better workaround for it.
  // https://github.com/TanStack/query/issues/3975
  if (fetchStatus === 'idle') {
    return 'Enter the name of a launch to search for';
  }
}

export function LaunchesListingPage() {
  const [sortField, setSortField] = useState(SortField.DATE);
  const [sortAscending, setSortAscending] = useState(false);
  const [launchName, setLaunchName] = useState('');
  const { data, isLoading, isFetching, fetchStatus } = useQuery(
    ['launches', sortField, sortAscending, launchName],
    () => fetchLaunchesByQuery({ offset: 0, limit: 50, sortField, sortAscending, launchName }),
    { keepPreviousData: true, enabled: Boolean(launchName) }
  );
  const hasLaunches = !!data?.docs?.length;
  return (
    <main className="p-8 mx-auto max-w-4xl space-y-8">
      <h1 className="text-2xl uppercase font-bold text-sky-400">SpaceX Launches</h1>
      <LaunchesSearchForm setLaunchName={setLaunchName} />
      <p
        role="alert"
        aria-atomic
        aria-live="polite"
        className="italic text-sky-400 bg-slate-800 inline-block rounded-full px-4 py-2"
      >
        {getAlertText(isLoading, isFetching, fetchStatus, data?.docs?.length ?? 0)}
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
                sortAscending={sortAscending}
                setSortField={setSortField}
                setSortAscending={setSortAscending}
              />
              <SortableTableHeader
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
                <td className="p-4 w-1/3">{name ?? 'Unknown'}</td>
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
