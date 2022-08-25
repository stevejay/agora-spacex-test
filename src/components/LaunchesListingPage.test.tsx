import { rest } from 'msw';
import { expect, it, vi } from 'vitest';

import { LaunchSummary } from '@/api/spacexApi';
import { server } from '@/mocks/server';
import { fireEvent, render, screen, within } from '@/testUtils';

import { LaunchesListingPage } from './LaunchesListingPage';

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

it('shows a page title', () => {
  installSearchHandler({ docs: [LAUNCH_ONE] });
  render(<LaunchesListingPage />);
  screen.getByRole('heading', { level: 1, name: 'SpaceX Launches' });
});

it('shows a loading message while the launches are being fetched', () => {
  installSearchHandler({ docs: [LAUNCH_ONE] });
  render(<LaunchesListingPage />);
  expect(screen.getByRole('alert')).to.have.text('Fetching results');
  expect(screen.queryByRole('table')).not.to.exist;
});

it('alerts the user when there are no results', async () => {
  installSearchHandler({ docs: [] });
  render(<LaunchesListingPage />);
  expect(await screen.findByText('No results found')).to.exist;
  expect(screen.getByRole('alert')).to.have.text('No results found');
  expect(screen.queryByRole('table')).not.to.exist;
});

it('alerts the user when there is a single result', async () => {
  installSearchHandler({ docs: [LAUNCH_ONE] });
  render(<LaunchesListingPage />);
  expect(await screen.findByText('1 result found')).to.exist;
  expect(screen.getByRole('alert')).to.have.text('1 result found');
});

it('alerts the user when there are multiple results', async () => {
  installSearchHandler({ docs: [LAUNCH_ONE, LAUNCH_TWO] });
  render(<LaunchesListingPage />);
  expect(await screen.findByText('2 results found')).to.exist;
  expect(screen.getByRole('alert')).to.have.text('2 results found');
});

it('displays the results in a table', async () => {
  installSearchHandler({ docs: [LAUNCH_ONE, LAUNCH_TWO] });
  render(<LaunchesListingPage />);
  const table = await screen.findByRole('table');
  within(table).getByRole('columnheader', { name: /Name/ });
  within(table).getByRole('columnheader', { name: /Date/ });

  let row = within(table).getByTestId(LAUNCH_ONE.id);
  expect(within(row).getByRole('cell', { name: LAUNCH_ONE.name })).to.exist;
  expect(within(row).getByRole('cell', { name: LAUNCH_ONE.date_utc })).to.exist;
  expect(within(row).getByRole('button', { name: 'View rocket details' })).to.exist;

  row = within(table).getByTestId(LAUNCH_TWO.id);
  expect(within(row).getByRole('cell', { name: LAUNCH_TWO.name })).to.exist;
  expect(within(row).getByRole('cell', { name: LAUNCH_TWO.date_utc })).to.exist;
  expect(within(row).getByRole('button', { name: 'View rocket details' })).to.exist;
});

it('allows the user to view the details of a launch that has details', async () => {
  HTMLDialogElement.prototype.showModal = vi.fn();
  installSearchHandler({ docs: [LAUNCH_ONE, LAUNCH_TWO] });
  render(<LaunchesListingPage />);
  const table = await screen.findByRole('table');
  const row = within(table).getByTestId(LAUNCH_ONE.id);
  fireEvent.click(within(row).getByRole('button', { name: 'View rocket details' }));
  expect(HTMLDialogElement.prototype.showModal).toHaveBeenCalledOnce();

  // TODO waiting for https://github.com/jsdom/jsdom/pull/3403 to be merged and released for
  // HTML modal dialog functions to be supported in JSDOM.
});

it('prevents the user from viewing the details of a launch that does not have details', async () => {
  installSearchHandler({ docs: [LAUNCH_ONE, LAUNCH_TWO] });
  render(<LaunchesListingPage />);
  const table = await screen.findByRole('table');
  const row = within(table).getByTestId(LAUNCH_TWO.id);
  expect(within(row).getByRole('button', { name: 'View rocket details' })).to.have.attribute('disabled');
});

it('initially sorts by date descending', async () => {
  const capturedRequest = { current: '' };
  installSearchHandler({ docs: [LAUNCH_ONE] }, capturedRequest);
  render(<LaunchesListingPage />);
  const table = await screen.findByRole('table');
  expect(within(table).getByRole('columnheader', { name: /Name/ })).not.to.have.attribute('aria-sort');
  expect(within(table).getByRole('columnheader', { name: /Date/ })).to.have.attribute('aria-sort', 'descending');
  expect(capturedRequest.current).toEqual({
    query: { upcoming: false },
    options: { sort: { date_utc: 'desc' }, limit: 50, offset: 0 }
  });
});

it('allows the user to change the date sorting from descending to ascending', async () => {
  const capturedRequest = { current: '' };
  installSearchHandler({ docs: [LAUNCH_ONE] }, capturedRequest);
  render(<LaunchesListingPage />);
  const table = await screen.findByRole('table');
  expect(within(table).getByRole('columnheader', { name: /Date/ })).to.have.attribute('aria-sort', 'descending');
  fireEvent.click(within(table).getByRole('button', { name: /Date/ }));

  await screen.findByText('Fetching results');
  await screen.findByText('1 result found');

  expect(within(table).getByRole('columnheader', { name: /Name/ })).not.to.have.attribute('aria-sort');
  expect(within(table).getByRole('columnheader', { name: /Date/ })).to.have.attribute('aria-sort', 'ascending');

  expect(capturedRequest.current).toEqual({
    query: { upcoming: false },
    options: { sort: { date_utc: 'asc' }, limit: 50, offset: 0 }
  });
});

it('allows the user to sort by name', async () => {
  const capturedRequest = { current: '' };
  installSearchHandler({ docs: [LAUNCH_ONE] }, capturedRequest);
  render(<LaunchesListingPage />);
  const table = await screen.findByRole('table');

  // Sort by name descending
  fireEvent.click(within(table).getByRole('button', { name: /Name/ }));
  await screen.findByText('Fetching results');
  await screen.findByText('1 result found');
  expect(within(table).getByRole('columnheader', { name: /Name/ })).to.have.attribute('aria-sort', 'descending');
  expect(within(table).getByRole('columnheader', { name: /Date/ })).not.to.have.attribute('aria-sort');
  expect(capturedRequest.current).toEqual({
    query: { upcoming: false },
    options: { sort: { name: 'desc' }, limit: 50, offset: 0 }
  });

  // Sort by name ascending
  fireEvent.click(within(table).getByRole('button', { name: /Name/ }));
  await screen.findByText('Fetching results');
  await screen.findByText('1 result found');
  expect(within(table).getByRole('columnheader', { name: /Name/ })).to.have.attribute('aria-sort', 'ascending');
  expect(capturedRequest.current).toEqual({
    query: { upcoming: false },
    options: { sort: { name: 'asc' }, limit: 50, offset: 0 }
  });
});

it('displays a search form', () => {
  installSearchHandler({ docs: [LAUNCH_ONE] });
  render(<LaunchesListingPage />);
  const form = screen.getByRole('form', { name: 'Search launches' });
  const searchbox = within(form).getByRole('searchbox', { name: 'Search launches' });
  expect(searchbox).to.have.value('');
  expect(searchbox).to.have.attribute('placeholder', 'Enter a launch name…');
  expect(within(form).getByRole('button', { name: 'Search' })).to.exist;
  expect(within(form).getByRole('button', { name: 'Clear' })).to.exist;
});

it('allows the user to search by launch name', async () => {
  const capturedRequest = { current: '' };
  installSearchHandler({ docs: [LAUNCH_ONE] }, capturedRequest);
  render(<LaunchesListingPage />);
  const form = screen.getByRole('form', { name: 'Search launches' });
  fireEvent.change(within(form).getByLabelText('Search launches'), { target: { value: 'Starlink' } });
  fireEvent.click(within(form).getByRole('button', { name: 'Search' }));

  await screen.findByText('Fetching results');
  await screen.findByText('1 result found');

  expect(capturedRequest.current).toEqual({
    query: { upcoming: false, name: { $regex: 'Starlink', $options: 'xi' } },
    options: { sort: { date_utc: 'desc' }, limit: 50, offset: 0 }
  });
});

it('allows the user to clear the launch name', () => {
  const handler = rest.post(QUERY_URL, (req, res, ctx) => res(ctx.json({ docs: [LAUNCH_ONE] })));
  server.use(handler);
  render(<LaunchesListingPage />);
  const form = screen.getByRole('form', { name: 'Search launches' });
  const searchbox = within(form).getByRole('searchbox', { name: 'Search launches' });
  fireEvent.change(searchbox, { target: { value: 'Starlink' } });
  expect(searchbox).to.have.value('Starlink');
  fireEvent.click(within(form).getByRole('button', { name: 'Clear' }));
  expect(searchbox).to.have.value('');
});
