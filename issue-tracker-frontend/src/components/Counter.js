import React, {useEffect, useState} from "react";

function Counter(params) {
    const [Counter, setCounter] = useState(0);
    useEffect(() => {
        document.title = `Counter: ${Counter}`;
    });
    return (
        <div>
            <h2>{Counter}</h2>
            <button onClick={() => setCounter(Counter + 1)}>Increment</button>
            <button onClick={() => setCounter(Counter - 1)}>Decrement</button>
        </div>
    )
}

export default Counter;