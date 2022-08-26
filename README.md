# Agora SpaceX Test

This is literally a single page app for searching for SpaceX launches. I used my standard vite starter script in [this gist](https://gist.github.com/stevejay/e8067e8ea953aaad979c4408e61f6322); there are no Storybook or Playwright tests.

## Running the app

1. `cd` into this project directory.
1. Run `yarn`.
1. Run `yarn dev`.

The app should now be available to view using the URL `http://localhost:5173/`.

The tests can be run using `yarn test`. You need to run the tests using a version of node less than v18; I use node v17.

## Improvements

- There is some duplicated element styling, particularly with the buttons. A reusable button component could be created to fix this.
- For simplicity I used the HTML dialog element to show the launch details, but for better tab trapping and focus handling I would switch to dialog library component.
- I could disable the search and clear buttons if there is no search term in the searchbox.
- I could look for and handle any error response from the API.
- I could map the response from the SpaceX API so that, for example, the property 'date_utc' is mapped to 'dateUtc'. This means the property name matches JavaScript conventions. That property could also be mapped to a `Date` object.
- I could use the query string or hash of the URL to 'store' the search state. This would allow deep-linking to particular search results. I think this state could be managed using jotai and the `atomWithHash` util.
