import { useState } from 'react';

import logo from './assets/react.svg';

export function App() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <header className="flex flex-col items-center space-y-4">
        <img src={logo} alt="logo" className="w-48 h-48" />
        <h1 className="text-2xl font-bold">Hello Vite + React! (mode={import.meta.env.MODE})</h1>
        <p>
          <button type="button" onClick={() => setCount((count) => count + 1)}>
            Count is: {count}
          </button>
        </p>
      </header>
    </div>
  );
}
