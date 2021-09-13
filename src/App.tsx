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

      <h2>Run big job ⛏</h2>

      <div className="buttonContainer">
        <button
          onClick={async () => {
            setState('loading');
            const worker = new Worker('./worker', { name: 'runBigTaskWorker', type: 'module' });
            const { runBigTask } = wrap<import('./worker').RunBigTaskWorker>(worker);
            setState(await runBigTask(50000000));
          }}
        >
          on Web Worker
        </button>

        <span>Run big job in separated thread. It can't block the UI. The user will thank 😇</span>
      </div>

      <div className="buttonContainer">
        <button
          onClick={() => {
            setState('🏃 loading');
            setState(runBigTask(50000000));
          }}
        >
          Sync, on main thread
        </button>

        <span>Execute big job as a normal (synchronous) function, on the main thread. It can block the UI 😦</span>
      </div>

      <div className="buttonContainer">
        <button
          onClick={async () => {
            setState('loading');
            setState(await runAsyncBigTask(50000000));
          }}
        >
          Async, on main thread
        </button>
        <span>Try to execute the big task as an asynchronous code (using async). The main thread will jump into different jobs while finishing any one. But this job is very expensive. So, this can block the UI also. 😨</span>
      </div>

      <p>{state}</p>
    </div>
  );
}

export default App;
