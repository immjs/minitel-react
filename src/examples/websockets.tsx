import { render, Minitel } from '../index.js';
import { WebSocketServer, createWebSocketStream } from 'ws';

import React from 'react';

const wss = new WebSocketServer({ port: 8080 });

function App() {
    const [stuff, setStuff] = React.useState(1);
    const [time, setTime] = React.useState(Date.now());
    React.useEffect(() => {
        setInterval(() => setStuff(s => s + 1), 100);
        setInterval(() => setTime(Date.now()), 500);
    }, []);
    return (
        <yjoin>
            <xjoin invert widthAlign="middle">{Intl.DateTimeFormat('en-US', { timeStyle: 'medium' }).format(time)}</xjoin>
            <yjoin flexGrow heightAlign="middle" gap="space-evenly">
                <xjoin widthAlign="middle" bg={7} fg={0}>
                    <para doubleHeight doubleWidth>
                        {(stuff / 10).toFixed(1)} @ 9600 bauds
                    </para>
                </xjoin>
                <yjoin>
                    <para>
                        {App.toString()}
                    </para>
                </yjoin>
            </yjoin>
        </yjoin>
    );
};

wss.on('connection', function connection(ws) {
  const minitel = new Minitel(createWebSocketStream(ws, { encoding: 'utf8' }), { statusBar: true });
  
  ws.on('message', (stuff) => {
    console.log({ stuff })
  });

  render(<App />, minitel);
});
//////////
wss.on('listening', () => console.log('I exist!'));//
//////