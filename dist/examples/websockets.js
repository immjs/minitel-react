import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { render, Minitel } from '../index.js';
import { WebSocketServer, createWebSocketStream } from 'ws';
import React from 'react';
const wss = new WebSocketServer({ port: 8080 });
function App() {
    const [time, setTime] = React.useState(Date.now());
    React.useEffect(() => {
        setInterval(() => setTime(Date.now()), 500);
    }, []);
    return (_jsxs("yjoin", { children: [_jsx("xjoin", { invert: true, widthAlign: "middle", children: Intl.DateTimeFormat('en-US', { timeStyle: 'medium' }).format(time) }), _jsxs("yjoin", { flexGrow: true, heightAlign: "middle", gap: "space-evenly", children: [_jsxs("xjoin", { widthAlign: "middle", children: [_jsx("para", { bg: 7, fg: 0, doubleHeight: true, children: " " }), _jsx("para", { doubleHeight: true, doubleWidth: true, bg: 7, fg: 0, children: "Up @ 9600 bauds" }), _jsx("para", { bg: 7, fg: 0, doubleHeight: true, children: " " })] }), _jsx("xjoin", { children: _jsx("para", { children: App.toString() }) }), _jsx("xjoin", { widthAlign: "middle", children: _jsx("input", { width: 16, autofocus: true, type: "password" }) }), _jsx("xjoin", { widthAlign: "middle", children: _jsx("input", { width: 8, type: "password" }) })] })] }));
}
;
wss.on('connection', function connection(ws) {
    try {
        const minitel = new Minitel(createWebSocketStream(ws, { encoding: 'utf8' }), { statusBar: true });
        ws.on('message', (data) => console.log({ data }));
        render(_jsx(App, {}), minitel);
    }
    catch (err) {
        if (err.message.includes('readyState')) {
            return; // it does that sometimes
        }
        throw err;
    }
});
wss.on('listening', () => console.log('I exist!')); //
