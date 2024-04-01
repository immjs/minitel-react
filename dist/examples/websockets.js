import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { render, Minitel } from '../index.js';
import { WebSocketServer, createWebSocketStream } from 'ws';
import React from 'react';
const wss = new WebSocketServer({ port: 8080 });
function App() {
    const [stuff, setStuff] = React.useState(0);
    React.useEffect(() => {
        setInterval(() => setStuff(s => s + 10), 10000);
    }, []);
    return (_jsx("yjoin", { widthAlign: "start", heightAlign: "middle", invert: true, fg: 5, children: _jsxs("para", { children: ["Running for ", stuff, " seconds with code:", '\n', App.toString()] }) }));
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
