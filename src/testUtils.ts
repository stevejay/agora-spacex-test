import { ReactElement } from 'react';
import { render } from '@testing-library/react';

const customRender = (ui: ReactElement, options = {}) =>
  render(ui, {
    // wrap provider(s) here if needed
    wrapper: ({ children }) => children,
    ...options
  });

/* eslint-disable import/export */
export * from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event';
export { customRender as render }; // override render export
/* eslint-enable import/export */
