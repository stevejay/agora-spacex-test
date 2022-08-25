# Agora SpaceX Test

This is literally a single page app for searching for SpaceX launches. I used my standard vite starter script in [this gist](https://gist.github.com/stevejay/e8067e8ea953aaad979c4408e61f6322).

## Running the app

1. `cd` into this project directory.
1. Run `yarn`.
1. Run `yarn dev`.

The app should now be available to view using the URL `http://localhost:5173/`.

The tests can be run using `yarn test`. You need to run the tests using a version of node less than v18; I use node v17.

## Improvements

- There is some duplicated element styling, particularly with the buttons. A reusable button component could be created to fix this.

## Issues

- `@typescript-eslint/eslint-plugin` version is locked to v5.33.0 because of [a bug with the latest version](https://github.com/typescript-eslint/typescript-eslint/issues/5525).
- Storybook needs to be run with node v16. It cannot be run currently with a later version.
