import { messageTypes } from "@/messages"
import { useEffect, useState } from 'react'
import './App.css'


export default function App() {
    const [domains, setDomains] = useState([]);
    const [newSite, setNewSite] = useState('');

    useEffect(() => {
        const getSettings = async () => {
            // Get the list of sites in settings from the backend

            const { domains } = await chrome.storage.sync.get("domains");
            // @ts-expect-error
            setDomains(domains);
        }

        getSettings();
    }, []);

    // @ts-expect-error
    const handleSubmit = async (event) => {
        event.preventDefault();

        // Pass new site to backend
        await chrome.runtime.sendMessage({
            type: messageTypes.ADD_SITE,
            site: newSite
        }, (response) => {

            console.log('received user data', response);

            setDomains(response.domains)
        });
        // clear the state
        setNewSite('');
    }

    const handleDelete = async (site: string) => {
        // Delete Site
        await chrome.runtime.sendMessage({
            type: messageTypes.REMOVE_SITE,
            site
        }, (response) => {
            setDomains(response.domains)
        });
    }

    return (
        <div>
            <h2>Options Page</h2>

            <form onSubmit={handleSubmit}>
                {/* @ts-expect-error */}
                <input type="text" value={newSite} onInput={(e) => setNewSite(e.target.value)} />

                <button type="submit" disabled={newSite === ''}>Submit</button>
            </form>

            {domains.length > 0 && (
                <ul>
                    {domains.map((domain) => {
                        return (
                            <li key={`item-${domain}`}>
                                {domain}
                                <button onClick={() => handleDelete(domain)}>Delete Site</button>
                            </li>
                        )
                    })}
                </ul>
            )}
        </div>
    )
}
