import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { render, Minitel } from '../index.js';
import { WebSocketServer, createWebSocketStream } from 'ws';
import React from 'react';
const wss = new WebSocketServer({ port: 8080 });
function App() {
    const [stuff, setStuff] = React.useState(1);
    const [time, setTime] = React.useState(Date.now());
    // React.useEffect(() => {
    //     setInterval(() => setStuff(s => s + 1), 100);
    //     setInterval(() => setTime(Date.now()), 500);
    // }, []);
    return (_jsxs("yjoin", { children: [_jsx("xjoin", { invert: true, widthAlign: "middle", children: Intl.DateTimeFormat('en-US', { timeStyle: 'medium' }).format(time) }), _jsxs("yjoin", { flexGrow: true, heightAlign: "middle", gap: "space-evenly", children: [_jsxs("xjoin", { widthAlign: "middle", children: [_jsx("para", { bg: 7, fg: 0, doubleHeight: true, children: " " }), _jsxs("para", { doubleHeight: true, doubleWidth: true, bg: 7, fg: 0, children: [(stuff / 10).toFixed(1), " @ 9600 bauds"] }), _jsx("para", { bg: 7, fg: 0, doubleHeight: true, children: " " })] }), _jsx("xjoin", { children: _jsx("para", { children: App.toString() }) }), _jsx("xjoin", { widthAlign: "middle", children: _jsx("input", { width: 16, autofocus: true, type: "password" }) }), _jsx("xjoin", { widthAlign: "middle", children: _jsx("input", { width: 8, type: "password" }) })] })] }));
}
;
wss.on('connection', function connection(ws) {
    const minitel = new Minitel(createWebSocketStream(ws, { encoding: 'utf8' }), { statusBar: true });
    render(_jsx(App, {}), minitel);
});
//////////
wss.on('listening', () => console.log('I exist!')); //
