import { FormEventHandler, useState } from 'react';

export interface LaunchesSearchFormProps {
  launchName: string;
  setLaunchName: (name: string) => void;
  clearSearchParams: () => void;
}

export function LaunchesSearchForm({ launchName, setLaunchName, clearSearchParams }: LaunchesSearchFormProps) {
  const [searchText, setSearchText] = useState(launchName);
  const handleSearchSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    setLaunchName(searchText);
  };
  return (
    <form onSubmit={handleSearchSubmit} aria-labelledby="nameSearchLabel" key={launchName}>
      <label id="nameSearchLabel" htmlFor="nameSearch" className="sr-only">
        Search launches
      </label>
      <div className="flex gap-4">
        <input
          type="text"
          role="searchbox"
          name="searchTerm"
          id="nameSearch"
          placeholder="Enter a launch name&hellip;"
          value={searchText}
          onChange={(event) => setSearchText(event.target.value)}
          className="flex-grow p-2 bg-slate-700 rounded"
          autoCapitalize="off"
          autoComplete="off"
          autoCorrect="off"
        />
        <button type="submit" className="bg-sky-600 hover:bg-sky-700 rounded px-4 py-2">
          Search
        </button>
        <button
          type="button"
          className="bg-slate-600 hover:bg-slate-700 rounded px-4 py-2"
          onClick={() => {
            clearSearchParams();
            setSearchText('');
          }}
        >
          Clear
        </button>
      </div>
    </form>
  );
}
