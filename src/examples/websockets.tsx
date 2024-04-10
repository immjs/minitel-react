import { render, Minitel } from '../index.js';
import { WebSocketServer, createWebSocketStream } from 'ws';

import React from 'react';

const wss = new WebSocketServer({ port: 8080 });

function App() {
    const [time, setTime] = React.useState(Date.now());
    const [randomValue, setRandomValue] = React.useState(0);
    React.useEffect(() => {
        setInterval(() => {
            setTime(Date.now());
            setRandomValue((r) => ({'0': 3,'3': 1}[r])!);
        }, 2_000);
    }, []);
    return (
        <yjoin>
            <xjoin invert widthAlign="middle">{Intl.DateTimeFormat('en-US', { timeStyle: 'medium' }).format(time)}</xjoin>
            <yjoin flexGrow heightAlign="middle" gap="space-evenly">
                <xjoin widthAlign="middle">
                    <para bg={7} fg={0} doubleHeight> </para>
                    <para doubleHeight doubleWidth bg={7} fg={0}>
                        Up @ 9600 bauds
                    </para>
                    <para bg={7} fg={0} doubleHeight> </para>
                </xjoin>
                <xjoin>
                    <para>
                        {App.toString()}
                    </para>
                </xjoin>
                <yjoin widthAlign="middle">
                    <para doubleHeight doubleWidth fg={0} bg={7}> {'I'.repeat(randomValue)} </para>
                    <input autofocus />
                </yjoin>
            </yjoin>
        </yjoin>
    );
};

wss.on('connection', function connection(ws) {
    try {
        const minitel = new Minitel(createWebSocketStream(ws, { decodeStrings: false }), { statusBar: true });

        ws.on('message', (data) => console.log({ data }));

        render(<App />, minitel);
    } catch (err) {
        console.log((err as Error).message);
        if ((err as Error).message.includes('readyState')) {
            return; // it does that sometimes
        }
        throw err;
    }
});

wss.on('error', () => {});

wss.on('listening', () => console.log('I exist!'));//
