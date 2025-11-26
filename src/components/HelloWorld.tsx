import { useState, useEffect } from 'react'

export default function HelloWorld(props: { msg: string }) {
  const [count, setCount] = useState(undefined);


  useEffect(() => {
    chrome.storage.sync.get(['count'], (result) => {
      console.log({result})
      // @ts-expect-error
      setCount(result?.count)
    });


    chrome.runtime.onMessage.addListener((request) => {
        if (request.type === 'BACKEND-COUNT') {
            console.log('Received a message from backend, and count is ', request?.count)
        }

        console.log({count, rc: request.count})

        if (count === request.count) {
          return;
        }

        setCount(request.count);
    });
  }, [])



  useEffect(() => {
    chrome.storage.sync.set({ count })
    chrome.runtime.sendMessage({ type: 'COUNT', count })
  }, [count])



  return (
    <>
      <h1>{props.msg}</h1>

      <div className="card">
        {/* @ts-expect-error */}
        <button type="button" onClick={() => setCount((typeof count !== 'undefined' ? count : 0) + 1)}>
          count is
          {' '}
          {count}
        </button>
        <p>
          Edit
          <code>src/components/HelloWorld.tsx</code>
          {' '}
          to test HMR
        </p>
      </div>

      <p>
        Check out
        <a href="https://github.com/crxjs/create-crxjs" target="_blank" rel="noreferrer">create-crxjs</a>
        , the official starter
      </p>

      <p className="read-the-docs">
        Click on the Vite, React and CRXJS logos to learn more
      </p>
    </>
  )
}
