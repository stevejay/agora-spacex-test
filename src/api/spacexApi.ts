import { SortField } from '@/types';

const baseUrl = 'https://api.spacexdata.com';

export interface LaunchSummary {
  id: string;
  name: string;
  date_utc: string;
  details?: string | null;
}

export interface LaunchesQueryResponse {
  docs: readonly LaunchSummary[];
}

export async function fetchLaunchesByQuery({
  offset,
  limit,
  sortField,
  sortAscending,
  launchName
}: {
  offset: number;
  limit: number;
  sortField: SortField;
  sortAscending: boolean;
  launchName?: string;
}): Promise<LaunchesQueryResponse> {
  const query: { upcoming: boolean; name?: object } = { upcoming: false };
  if (launchName) {
    // Options docs: https://www.mongodb.com/docs/manual/reference/operator/query/regex/#mongodb-query-op.-options
    query.name = { $regex: launchName, $options: 'xi' };
  }
  const response = await fetch(`${baseUrl}/v4/launches/query`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query,
      options: {
        sort: { [sortField]: sortAscending ? 'asc' : 'desc' },
        limit,
        offset
      }
    })
  });
  return response.json();
}
