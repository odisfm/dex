import {useState} from 'react'

function App() {
    const [text, setText] = useState("...")

    const testServer = async () => {
        const API_BASE_URL = import.meta.env.VITE_API_URL;
        try {
            const response = await fetch(`${API_BASE_URL}/test`,
                {
                    method: 'GET',
                })
            const data = await response.json()
            setText(data.message)

        } catch(e: unknown) {
            alert(String(e))
        }
    }


    return (
        <main className="grow-1 flex flex-col gap-3 items-center justify-center h-screen text-white bg-neutral-900">
            <h1 className="text-5xl self-center px-12 py-3 bg-neutral-800 rounded-md">{text}</h1>
            <button
                className="bg-sky-600 hover:bg-sky-800 text-white font-bold p-4 rounded-lg mt-4 cursor-pointer"
                onClick={() => testServer()}>
                Test
            </button>
        </main>
    )
}

export default App
