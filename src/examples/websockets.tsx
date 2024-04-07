import { render, Minitel } from '../index.js';
import { WebSocketServer, createWebSocketStream } from 'ws';

import React from 'react';

const wss = new WebSocketServer({ port: 8080 });

function App() {
    const [stuff, setStuff] = React.useState(1);
    React.useEffect(() => {
        setInterval(() => setStuff(s => s + 0.5), 50);
    }, []);
    return (
        <yjoin widthAlign="middle" heightAlign="middle">
            <para bg={6} fg={0}>
                {` ${(stuff / 10).toFixed(2)} `}
            </para>
            <yjoin width={40}>
                <para>
                    {App.toString()}
                </para>
            </yjoin>
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