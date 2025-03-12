import { render, Minitel, useKeyboard } from '../index.js';
import { WebSocket, WebSocketServer, createWebSocketStream } from 'ws';

import React, { useRef, useState } from 'react';
import { DuplexBridge } from 'ws-duplex-bridge';
import { Paragraph, Scrollable } from 'minitel-standalone';

const wss = new WebSocketServer({ port: 8080 });

function App() {
    const [stuff, setStuff] = useState('');

    const paraElm = useRef<Paragraph>(null);

    useKeyboard((v) => console.log(v));

    return (
        <mt-zjoin>
            <mt-input autofocus multiline onScroll={(sD) => {
                paraElm.current!.attributes.pad = [-sD[0], 0, 0, -sD[1]];
            }} onChange={(txt) => {setStuff(txt)}} fillChar='\x09' visible={false} />
            <mt-cont fillChar='.'><mt-para flexGrow ref={paraElm}>{stuff}</mt-para></mt-cont>
        </mt-zjoin>
    );
};

wss.on('connection', function connection(ws) {
    const bridge = new DuplexBridge(ws);

    const minitel = new Minitel(bridge, { statusBar: false });

    // ws.on('message', (data) => console.log({ data }));

    render(<App />, minitel);
});

wss.on('error', () => {});

wss.on('listening', () => console.log('I exist!'));//
