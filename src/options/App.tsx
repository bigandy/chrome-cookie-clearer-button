// import HelloWorld from '@/components/HelloWorld'
import { useEffect, useState } from 'react'
import './App.css'


export default function App() {

//   const handleClear = () => {
//     chrome.runtime.sendMessage({
//       type: "CLEAR_CACHE"
//     })
//   }

    const [domains, setDomains] = useState([]);

    useEffect(() => {
        const getSettings = async () => {
            // Get the list of sites in settings from the backend


            const {domains} = await chrome.storage.sync.get("domains");
            // @ts-expect-error
            setDomains(domains);
        }

        getSettings();

        // update the state with it
    }, []);

    // @ts-expect-error
    const handleSubmit = (event) => {
        event.preventDefault();

        console.log({event})
    }


  return (
    <div>
      <h2>Options Page</h2>

        <form onSubmit={handleSubmit}>
            {domains.length > 0 && (
                <ul>
                    {domains.map((domain, index) => {
                        return (
                            <li key={`item-${index}`}>
                                {domain}
                            </li>
                        )
                    })}
                </ul>
            )}

            <button type="submit">Submit</button>
        </form>
    </div>
  )
}
