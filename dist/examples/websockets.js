import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { render, Minitel } from '../index.js';
import { WebSocketServer, createWebSocketStream } from 'ws';
import React from 'react';
const wss = new WebSocketServer({ port: 8080 });
function App() {
    const [stuff, setStuff] = React.useState(1);
    React.useEffect(() => {
        setInterval(() => setStuff(s => s + 1), 100);
    }, []);
    return (_jsxs("yjoin", { widthAlign: "middle", heightAlign: "middle", children: [_jsx("para", { fg: 0, bg: 7, underline: true, doubleHeight: true, children: ` ${(stuff / 10).toFixed(1)} ` }), _jsx("yjoin", { width: 40, children: _jsx("para", { children: App.toString() }) })] }));
}
;
wss.on('connection', function connection(ws) {
    const minitel = new Minitel(createWebSocketStream(ws, { encoding: 'utf8' }));
    ws.on('message', (stuff) => {
        console.log({ stuff });
    });
    render(_jsx(App, {}), minitel);
});
//////////
wss.on('listening', () => console.log('I exist!')); //
