import { render, Minitel } from '../index.js';
import { WebSocketServer, createWebSocketStream } from 'ws';

import React from 'react';

const wss = new WebSocketServer({ port: 8080 });

function App() {
    const [stuff, setStuff] = React.useState(0);
    React.useEffect(() => {
        setInterval(() => setStuff(s => s + 10), 10_000);
    }, []);
    return (
        <yjoin widthAlign="start" heightAlign="middle" invert fg={5}>
            <para>
                Running for {stuff} seconds with code:{'\n'}
                {App.toString()}
            </para>
        </yjoin>
    );
};

wss.on('connection', function connection(ws) {
  const minitel = new Minitel(createWebSocketStream(ws, { encoding: 'utf8' }));
  
  ws.on('message', (stuff) => {
    console.log({ stuff })
  });

  render(<App />, minitel);
});
//////////
wss.on('listening', () => console.log('I exist!'));//
//////