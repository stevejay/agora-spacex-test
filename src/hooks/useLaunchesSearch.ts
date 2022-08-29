import { useCallback } from 'react';
import { useAtom } from 'jotai';
import { atomWithHash } from 'jotai/utils';

import { SortField } from '@/types';

export const sortFieldAtom = atomWithHash<SortField>('sortField', SortField.DATE);
export const sortAscendingAtom = atomWithHash<boolean>('sortAscending', false);
export const launchNameAtom = atomWithHash<string>('launchName', '');

export function useLaunchesSearch() {
  const [sortField, setSortField] = useAtom(sortFieldAtom);
  const [sortAscending, setSortAscending] = useAtom(sortAscendingAtom);
  const [launchName, setLaunchName] = useAtom(launchNameAtom);

  const resetLaunchesSearch = useCallback(() => {
    setSortField(SortField.DATE);
    setSortAscending(false);
    setLaunchName('');
  }, [setSortField, setSortAscending, setLaunchName]);

  return {
    sortField,
    setSortField,
    sortAscending,
    setSortAscending,
    launchName,
    setLaunchName,
    resetLaunchesSearch
  };
}
