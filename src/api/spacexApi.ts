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
  if (!launchName) {
    return { docs: [] };
  }
  const response = await fetch(`${baseUrl}/v4/launches/query`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      // Options docs: https://www.mongodb.com/docs/manual/reference/operator/query/regex/#mongodb-query-op.-options
      query: { upcoming: false, name: { $regex: launchName, $options: 'xi' } },
      options: {
        sort: { [sortField]: sortAscending ? 'asc' : 'desc' },
        limit,
        offset,
        select: 'id name date_utc details'
      }
    })
  });
  if (response.status !== 200) {
    if (response.status >= 400 && response.status <= 499) {
      return { docs: [] };
    }
    throw new Error('Server error when fetching search results');
  }
  return response.json();
}
