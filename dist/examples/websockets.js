import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { render, Minitel, useKeyboard } from '../index.js';
import { WebSocketServer } from 'ws';
import { useRef, useState } from 'react';
import { DuplexBridge } from 'ws-duplex-bridge';
const wss = new WebSocketServer({ port: 8080 });
function App() {
    const [stuff, setStuff] = useState('');
    const paraElm = useRef(null);
    useKeyboard((v) => console.log(v));
    return (_jsxs("zjoin", { children: [_jsx("input", { autofocus: true, multiline: true, onScroll: (sD) => {
                    paraElm.current.attributes.pad = [-sD[0], 0, 0, -sD[1]];
                }, onChange: (txt) => { setStuff(txt); }, fillChar: '\\x09', visible: false }), _jsx("cont", { fillChar: '.', children: _jsx("para", { flexGrow: true, ref: paraElm, children: stuff }) })] }));
}
;
wss.on('connection', function connection(ws) {
    const bridge = new DuplexBridge(ws);
    const minitel = new Minitel(bridge, { statusBar: false });
    // ws.on('message', (data) => console.log({ data }));
    render(_jsx(App, {}), minitel);
});
wss.on('error', () => { });
wss.on('listening', () => console.log('I exist!')); //
