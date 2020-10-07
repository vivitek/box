import { useState } from 'react'
import Head from 'next/head'

export default function Home() {
  const [value, setValue] = useState('')
  const [result, setResult] = useState('')

  const dnsRequest = async () => {
    const res = await fetch('/api/dns' , {
      method: 'POST',
      body: JSON.stringify({ addr: value }),
      headers: { Accept: 'application/json', 'Content-Type': 'application/json'}
    })
    console.log('RES=', res)
    let got = await res.json()
    setResult(got.hostname)
  }

  return (
    <div>
      <Head>
        <title>DNS Lookup test</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="h-screen">
        <div>
          <div className="w-full flex px-4 py-2 border-b border-gray-600 justify-center">
            <div className="text-center">
              <text className="text-4xl text-blue-600">DNS Lookup Test</text>
            </div>
          </div>
          <div className="w-full flex items-center justify-center">
            <div className={`w-1/3 row ${result ? 'mt-8' : 'mt-16'}`}>
              {result && <div className="mb-4 flex row">
              <text>Result is: <em className="text-blue-600 text-xl">{result}</em></text>
            </div>}
              <div className="my-4">
                <label className="block text-gray-700 text-sm font-bold mb-2 ml-4">
                  IP Adress
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  type="text" value={value} onChange={event => setValue(event.target.value)} placeholder="IP"
                />
              </div>
              <div className="justify-end flex">
                <div className="bg-blue-600 text-white rounded-lg px-4 py-2" onClick={dnsRequest}>
                  Envoyer
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
