import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
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
            setRandomValue((r) => ({ '0': 3, '3': 1 }[r]));
        }, 2000);
    }, []);
    return (_jsxs("yjoin", { children: [_jsx("xjoin", { invert: true, widthAlign: "middle", children: Intl.DateTimeFormat('en-US', { timeStyle: 'medium' }).format(time) }), _jsxs("yjoin", { flexGrow: true, heightAlign: "middle", gap: "space-evenly", children: [_jsxs("xjoin", { widthAlign: "middle", children: [_jsx("para", { bg: 7, fg: 0, doubleHeight: true, children: " " }), _jsx("para", { doubleHeight: true, doubleWidth: true, bg: 7, fg: 0, children: "Up @ 9600 bauds" }), _jsx("para", { bg: 7, fg: 0, doubleHeight: true, children: " " })] }), _jsx("xjoin", { children: _jsx("para", { children: App.toString() }) }), _jsx("scroll", { height: 5, children: _jsxs("yjoin", { widthAlign: "middle", gap: 10, children: [_jsxs("para", { doubleHeight: true, doubleWidth: true, fg: 0, bg: 7, children: [" ", 'I'.repeat(randomValue), " "] }), _jsx("input", {})] }) })] })] }));
}
;
wss.on('connection', function connection(ws) {
    try {
        const minitel = new Minitel(createWebSocketStream(ws, { decodeStrings: false }), { statusBar: true });
        ws.on('message', (data) => console.log({ data }));
        render(_jsx(App, {}), minitel);
    }
    catch (err) {
        console.log(err.message);
        if (err.message.includes('readyState')) {
            return; // it does that sometimes
        }
        throw err;
    }
});
wss.on('error', () => { });
wss.on('listening', () => console.log('I exist!')); //
