import { rest } from 'msw';
import { beforeEach, expect, it, vi } from 'vitest';

import { LaunchSummary } from '@/api/spacexApi';
import { server } from '@/mocks/server';
import { fireEvent, render, screen, within } from '@/testUtils';

import { LaunchesSearchPage } from './LaunchesSearchPage';

const QUERY_URL = 'https://api.spacexdata.com/v4/launches/query';

const LAUNCH_ONE = {
  details: 'Launch 1 details',
  name: 'Starlink 4-27 (v1.5)',
  date_utc: '2022-08-19T19:24:00.000Z',
  id: '62f3b5200f55c50e192a4e6c'
};

const LAUNCH_TWO = {
  details: null,
  name: 'Starlink 3-3 (v1.5)',
  date_utc: '2022-08-12T21:30:00.000Z',
  id: '62f3b4ff0f55c50e192a4e6b'
};

function installSearchHandler(response: { docs: readonly LaunchSummary[] }, capturedRequest?: { current: string }) {
  const handler = rest.post(QUERY_URL, async (req, res, ctx) => {
    if (capturedRequest) {
      capturedRequest.current = await req.json();
    }
    return res(ctx.json(response));
  });
  server.use(handler);
}

function searchForLaunchName(value: string) {
  const form = screen.getByRole('form', { name: 'Search launches' });
  fireEvent.change(within(form).getByLabelText('Search launches'), { target: { value } });
  fireEvent.click(within(form).getByRole('button', { name: 'Search' }));
}

beforeEach(() => {
  // Reset the URL hash to prevent the jotai atoms initializing themselves to those values:
  window.location.assign('#');
});

it('shows a page title', () => {
  render(<LaunchesSearchPage />);
  screen.getByRole('heading', { level: 1, name: 'SpaceX Launches' });
});

it('initially shows an instruction alert message', async () => {
  render(<LaunchesSearchPage />);
  expect(await screen.findByText('Enter the name of a launch to search for')).to.exist;
});

it('displays a search form', () => {
  render(<LaunchesSearchPage />);
  const form = screen.getByRole('form', { name: 'Search launches' });
  const searchbox = within(form).getByRole('searchbox', { name: 'Search launches' });
  expect(searchbox).to.have.value('');
  expect(searchbox).to.have.attribute('placeholder', 'Enter a launch name…');
  expect(within(form).getByRole('button', { name: 'Search' })).to.exist;
  expect(within(form).getByRole('button', { name: 'Clear' })).to.exist;
});

it('does not allow the user to search by launch name if they did not enter a search term', async () => {
  const capturedRequest = { current: '' };
  installSearchHandler({ docs: [LAUNCH_ONE] }, capturedRequest);
  render(<LaunchesSearchPage />);
  const form = screen.getByRole('form', { name: 'Search launches' });
  fireEvent.click(within(form).getByRole('button', { name: 'Search' }));
  expect(await screen.findByText('Enter the name of a launch to search for')).to.exist;
});

it('allows the user to search by launch name', async () => {
  const capturedRequest = { current: '' };
  installSearchHandler({ docs: [LAUNCH_ONE] }, capturedRequest);
  render(<LaunchesSearchPage />);
  searchForLaunchName('Starlink');

  await screen.findByText('Fetching results');
  await screen.findByText('1 result returned');

  expect(capturedRequest.current).toEqual({
    query: { upcoming: false, name: { $regex: 'Starlink', $options: 'xi' } },
    options: { sort: { date_utc: 'desc' }, limit: 50, offset: 0, select: 'id name date_utc details' }
  });
});

it('allows the user to clear the launch name', () => {
  installSearchHandler({ docs: [] });
  render(<LaunchesSearchPage />);
  const form = screen.getByRole('form', { name: 'Search launches' });
  fireEvent.change(screen.getByRole('searchbox', { name: 'Search launches' }), { target: { value: 'Starlink' } });
  expect(screen.getByRole('searchbox', { name: 'Search launches' })).to.have.value('Starlink');
  fireEvent.click(within(form).getByRole('button', { name: 'Clear' }));
  expect(screen.getByRole('searchbox', { name: 'Search launches' })).to.have.value('');
});

it('alerts the user to multiple returned results', async () => {
  installSearchHandler({ docs: [LAUNCH_ONE, LAUNCH_TWO] });
  render(<LaunchesSearchPage />);
  searchForLaunchName('Starlink');
  await screen.findByText('Fetching results');
  await screen.findByText('2 results returned');
});

it('alerts the user when there are no results', async () => {
  installSearchHandler({ docs: [] });
  render(<LaunchesSearchPage />);
  searchForLaunchName('Starlink');
  await screen.findByText('Fetching results');
  await screen.findByText('No results found');
  expect(screen.getByRole('alert')).to.have.text('No results found');
  expect(screen.queryByRole('table')).not.to.exist;
});

it('displays the results in a table', async () => {
  installSearchHandler({ docs: [LAUNCH_ONE, LAUNCH_TWO] });
  render(<LaunchesSearchPage />);
  searchForLaunchName('Starlink');

  const table = await screen.findByRole('table');
  within(table).getByRole('columnheader', { name: /Name/ });
  within(table).getByRole('columnheader', { name: /Date/ });

  let row = within(table).getByTestId(LAUNCH_ONE.id);
  expect(within(row).getByRole('cell', { name: LAUNCH_ONE.name })).to.exist;
  expect(within(row).getByRole('cell', { name: 'Fri, 19 Aug 2022 19:24:00 GMT' })).to.exist;
  expect(within(row).getByRole('button', { name: 'View rocket details' })).to.exist;

  row = within(table).getByTestId(LAUNCH_TWO.id);
  expect(within(row).getByRole('cell', { name: LAUNCH_TWO.name })).to.exist;
  expect(within(row).getByRole('cell', { name: 'Fri, 12 Aug 2022 21:30:00 GMT' })).to.exist;
  expect(within(row).getByRole('button', { name: 'View rocket details' })).to.exist;
});

it('allows the user to view the details of a launch that has details', async () => {
  HTMLDialogElement.prototype.showModal = vi.fn();
  installSearchHandler({ docs: [LAUNCH_ONE, LAUNCH_TWO] });
  render(<LaunchesSearchPage />);
  searchForLaunchName('Starlink');

  const table = await screen.findByRole('table');
  const row = within(table).getByTestId(LAUNCH_ONE.id);
  fireEvent.click(within(row).getByRole('button', { name: 'View rocket details' }));
  expect(HTMLDialogElement.prototype.showModal).toHaveBeenCalledOnce();

  // TODO waiting for https://github.com/jsdom/jsdom/pull/3403 to be merged and released for
  // HTML modal dialog functions to be supported in JSDOM.
});

it('prevents the user from viewing the details of a launch that does not have details', async () => {
  installSearchHandler({ docs: [LAUNCH_ONE, LAUNCH_TWO] });
  render(<LaunchesSearchPage />);
  searchForLaunchName('Starlink');
  const table = await screen.findByRole('table');
  const row = within(table).getByTestId(LAUNCH_TWO.id);
  expect(within(row).getByRole('button', { name: 'View rocket details' })).to.have.attribute('disabled');
});

it('allows the user to change the date sorting from descending to ascending', async () => {
  const capturedRequest = { current: '' };
  installSearchHandler({ docs: [LAUNCH_ONE] }, capturedRequest);
  render(<LaunchesSearchPage />);
  searchForLaunchName('Starlink');

  const table = await screen.findByRole('table');
  expect(within(table).getByRole('columnheader', { name: /Date/ })).to.have.attribute('aria-sort', 'descending');
  fireEvent.click(within(table).getByRole('button', { name: /Date/ }));

  await screen.findByText('Fetching results');
  await screen.findByText('1 result returned');

  expect(within(table).getByRole('columnheader', { name: /Name/ })).to.have.attribute('aria-sort', 'none');
  expect(within(table).getByRole('columnheader', { name: /Date/ })).to.have.attribute('aria-sort', 'ascending');

  expect(capturedRequest.current).toEqual({
    query: { upcoming: false, name: { $regex: 'Starlink', $options: 'xi' } },
    options: { sort: { date_utc: 'asc' }, limit: 50, offset: 0, select: 'id name date_utc details' }
  });
});

it('allows the user to sort by name', async () => {
  const capturedRequest = { current: '' };
  installSearchHandler({ docs: [LAUNCH_ONE] }, capturedRequest);
  render(<LaunchesSearchPage />);
  searchForLaunchName('Starlink');

  // Sort by name descending
  const table = await screen.findByRole('table');
  fireEvent.click(within(table).getByRole('button', { name: /Name/ }));
  await screen.findByText('Fetching results');
  await screen.findByText('1 result returned');
  expect(screen.getByRole('columnheader', { name: /Name/ })).to.have.attribute('aria-sort', 'descending');
  expect(screen.getByRole('columnheader', { name: /Date/ })).to.have.attribute('aria-sort', 'none');
  expect(capturedRequest.current).toEqual({
    query: { upcoming: false, name: { $regex: 'Starlink', $options: 'xi' } },
    options: { sort: { name: 'desc' }, limit: 50, offset: 0, select: 'id name date_utc details' }
  });

  // Sort by name ascending
  fireEvent.click(within(table).getByRole('button', { name: /Name/ }));
  await screen.findByText('Fetching results');
  await screen.findByText('1 result returned');
  expect(within(table).getByRole('columnheader', { name: /Name/ })).to.have.attribute('aria-sort', 'ascending');
  expect(capturedRequest.current).toEqual({
    query: { upcoming: false, name: { $regex: 'Starlink', $options: 'xi' } },
    options: { sort: { name: 'asc' }, limit: 50, offset: 0, select: 'id name date_utc details' }
  });
});

it('allows for deep-linking to a search', async () => {
  const capturedRequest = { current: '' };
  installSearchHandler({ docs: [LAUNCH_ONE] }, capturedRequest);
  window.location.assign('#launchName="star"&sortField="name"&sortAscending=true');
  render(<LaunchesSearchPage />);
  await screen.findByText('1 result returned');

  const form = screen.getByRole('form', { name: 'Search launches' });
  const searchbox = within(form).getByRole('searchbox', { name: 'Search launches' });
  expect(searchbox).to.have.value('star');

  const table = await screen.findByRole('table');
  expect(within(table).getByRole('columnheader', { name: /Name/ })).to.have.attribute('aria-sort', 'ascending');
});
