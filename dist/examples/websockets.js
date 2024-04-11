import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { render, Minitel } from '../index.js';
import { WebSocketServer, createWebSocketStream } from 'ws';
import React from 'react';
import { Duplex } from 'stream';
const wss = new WebSocketServer({ port: 8080 });
function App() {
    const [time, setTime] = React.useState(Date.now());
    const [randomValue, setRandomValue] = React.useState(0);
    React.useEffect(() => {
        setInterval(() => {
            setTime(Date.now());
            setRandomValue((r) => {
                console.log(r);
                return ({ '0': 3, '3': 0 }[r]);
            });
        }, 2000);
    }, []);
    return (_jsxs("yjoin", { children: [_jsx("xjoin", { invert: true, widthAlign: "middle", children: Intl.DateTimeFormat('en-US', { timeStyle: 'medium' }).format(time) }), _jsxs("zjoin", { flexGrow: true, children: [_jsxs("yjoin", { heightAlign: "middle", gap: "space-evenly", children: [_jsxs("xjoin", { widthAlign: "middle", children: [_jsx("para", { bg: 7, fg: 0, doubleHeight: true, children: " " }), _jsx("para", { doubleHeight: true, doubleWidth: true, bg: 7, fg: 0, children: "Up @ 9600 bauds" }), _jsx("para", { bg: 7, fg: 0, doubleHeight: true, children: " " })] }), _jsx("xjoin", { children: _jsx("para", { children: App.toString() }) }), _jsx("scroll", { height: 4, children: _jsxs("yjoin", { widthAlign: "middle", gap: 10, children: [_jsxs("para", { doubleHeight: true, doubleWidth: true, fg: 0, bg: 7, children: [" ", 'I'.repeat(randomValue), " "] }), _jsx("input", {})] }) })] }), _jsx("yjoin", { widthAlign: "middle", heightAlign: "middle", fillChar: '\x09', children: _jsx("yjoin", { pad: [0, 1], fillChar: ' ', children: _jsx("yjoin", { pad: [3, 6], bg: 5, fg: 3, children: "Hello world!" }) }) })] })] }));
}
;
class DuplexBridge extends Duplex {
    constructor(destinationStream, ws, opts) {
        super(opts);
        this.ws = ws;
        this.destinationStream = destinationStream;
        this.destinationStream.on('readable', () => this.push(this.destinationStream.read()));
    }
    _write(chunk, bufferEncoding, callback) {
        if (this.ws.readyState === this.ws.CONNECTING || this.ws.readyState === this.ws.OPEN) {
            this.destinationStream.write(chunk, bufferEncoding, callback);
        }
        else {
            console.log('Prevented disaster!');
            return;
        }
    }
    _read(size) {
        return this.destinationStream.read(size);
    }
}
wss.on('connection', function connection(ws) {
    const bridge = new DuplexBridge(createWebSocketStream(ws), ws);
    const minitel = new Minitel(bridge, { statusBar: true });
    ws.on('message', (data) => console.log({ data }));
    const derender = render(_jsx(App, {}), minitel);
    ws.on('close', () => {
        minitel.stream = new Duplex();
        derender();
        console.log('AYO');
    });
});
wss.on('error', () => { });
wss.on('listening', () => console.log('I exist!')); //
