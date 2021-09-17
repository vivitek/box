import io from 'socket.io-client';
import { useEffect, useState } from 'react';


const Home = () => {
    
    const [macArray, setMacArray] = useState([])
    
    useEffect(() => {
        const socket = io("ws://localhost:7000/");
        socket.on('newAddress', (address) => {
            setMacArray(oldArray => [...oldArray, address]);
        })
    }, [])

    return (
        <div>
            <h1>oifezokfoe</h1>
            {
                macArray.map((mac, idx) => (
                    <div key={idx} className="flex w-full justify-between">
                        <span>{mac}</span>
                        <button>approve</button>
                        <button>deny</button>
                    </div>
                ))
            }
        </div>
    )
}

export default Home;