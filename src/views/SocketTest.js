import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

export default () => {
    const [socket] = useState(() => io(':8000'));
    const [test, setTest] = useState(null);

    useEffect(() => {
        // Add event listener for when test is updated
        socket.on('test updated', data => { setTest(data) });

        // Close socket when App is unmounted
        return () => socket.disconnect(true);
    }, [socket]);

    const handleIncrement = event => {
        event.preventDefault();
        let temp = test + 1;
        socket.emit("increment", +temp)
    };
    const handleReset = event => {
        event.preventDefault();
        let temp = 0;
        socket.emit("increment", +temp)
    };

    return (
        <>
            <h1>Socket Test: {test}</h1>
            <button onClick={handleIncrement}>Add</button>
            <button onClick={handleReset}>Reset</button>
        </>
    );
}