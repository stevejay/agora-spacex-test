import { render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';

import { App } from '@/App';

it('should pass', () => {
  render(<App />);
  expect(screen.getByRole('heading')).to.have.text('Hello Vite + React! (mode=development)');
});
