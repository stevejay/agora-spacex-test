import { FormEventHandler, useState } from 'react';

export function LaunchSearchForm({ setLaunchName }: { setLaunchName: (name: string) => void }) {
  const [searchText, setSearchText] = useState('');
  const handleSearchSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    setLaunchName(searchText);
  };
  return (
    <form onSubmit={handleSearchSubmit} aria-labelledby="nameSearchLabel">
      <label id="nameSearchLabel" htmlFor="nameSearch" className="sr-only">
        Search launches
      </label>
      <div className="flex gap-4">
        <input
          type="text"
          role="searchbox"
          id="nameSearch"
          placeholder="Enter a launch name&hellip;"
          value={searchText}
          onChange={(event) => setSearchText(event.target.value.trim())}
          className="flex-grow p-2 bg-slate-700"
        />
        <button type="submit" className="bg-sky-600 hover:bg-sky-700 rounded px-4 py-2">
          Search
        </button>
        <button
          className="bg-slate-600 hover:bg-slate-700 rounded px-4 py-2"
          onClick={() => {
            setSearchText('');
            setLaunchName('');
          }}
        >
          Clear
        </button>
      </div>
    </form>
  );
}
