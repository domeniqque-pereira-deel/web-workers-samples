import { useEffect, useState } from 'react';
import { runAsyncBigTask, runBigTask } from './utils'
import { wrap } from 'comlink';

function App() {
  const [state, setState] = useState<string>();
  const [counter, setCounter] = useState<number>(0);

  const increment = () => {
    setCounter(state => state + 10);
  }

  const decrement = () => {
    setCounter(state => state - 10);
  }

  useEffect(() => {
    const id = setInterval(() => {
      setCounter(state => state + 1);
    }, 1000);

    return () => {
      clearTimeout(id);
    }
  }, [])

  return (
    <div className="container">
      <h1>Web Worker</h1>

      <div className="counters">
        <button onClick={decrement}>
          -10
        </button>

        <span>{counter}</span>

        <button onClick={increment}>
          +10
        </button>
      </div>

      <button
        onClick={async () => {
          setState('loading');
          const worker = new Worker('./worker', { name: 'runBigTaskWorker', type: 'module' });
          const { runBigTask } = wrap<import('./worker').RunBigTaskWorker>(worker);
          setState(await runBigTask(50000000));
        }}
      >
        Web Worker
      </button>

      <button
        onClick={() => {
          setState('🏃 loading');
          setState(runBigTask(50000000));
        }}
      >
        Sync on main thread
      </button>

      <button
        onClick={async () => {
          setState('loading');
          setState(await runAsyncBigTask(50000000));
        }}
      >
        Async on main thread
      </button>

      <p>{state}</p>
    </div>
  );
}

export default App;
