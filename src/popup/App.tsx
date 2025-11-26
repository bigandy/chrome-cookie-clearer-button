// import HelloWorld from '@/components/HelloWorld'
import './App.css'


export default function App() {

  const handleClear = () => {
    chrome.runtime.sendMessage({
      type: "CLEAR_CACHE"
    })
  }

  return (
    <div>
      <h2>Settings Page</h2>

      <button onClick={handleClear}>Clear Cache</button>
    </div>
  )
}
