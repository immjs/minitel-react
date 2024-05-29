import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { render, Minitel, useKeyboard } from '../index.js';
import { WebSocketServer, createWebSocketStream } from 'ws';
import { useRef, useState } from 'react';
import { Duplex } from 'stream';
const wss = new WebSocketServer({ port: 8080 });
function App() {
    // c[]);
    // return (
    //     <yjoin>
    //    onst [time, setTime] = React.useState(Date.now());
    // const [randomValue, setRandomValue] = React.useState(0);
    // React.useEffect(() => {
    //     setInterval(() => {
    //         setTime(Date.now());
    //     }, 1_000);
    // },      <xjoin bg={7} fg={0} widthAlign="middle">
    //             {Intl.DateTimeFormat('en-US', { timeStyle: 'medium' }).format(time)}
    //         </xjoin>
    //         <zjoin flexGrow>
    //             <yjoin heightAlign="middle" gap="space-evenly">
    //                 <xjoin widthAlign="middle">
    //                     <para bg={7} fg={0} doubleHeight> </para>
    //                     <para doubleHeight doubleWidth bg={7} fg={0}>
    //                         Up @ 9600 bauds
    //                     </para>
    //                     <para bg={7} fg={0} doubleHeight> </para>
    //                 </xjoin>
    //                 <xjoin>
    //                     <para>
    //                         {App.toString()}
    //                     </para>
    //                 </xjoin>
    //                 <scroll height={4} overflowY="scroll">
    //                     <yjoin widthAlign="middle" gap={0}>
    //                         {/* <para doubleHeight doubleWidth fg={0} bg={7}> {'I'.repeat(randomValue)} </para> */}
    //                         <input width={16} />
    //                         <para>
    //                             Hello world{'\n'}
    //                             Programmed to work and not to feel{'\n'}
    //                             Not even sure that it is real{'\n'}
    //                             Hello world
    //                         </para>
    //                     </yjoin>
    //                 </scroll>
    //             </yjoin>
    //             <yjoin widthAlign="middle" heightAlign="middle" fillChar={'\x09'}>
    //                 <yjoin pad={[0, 1]} fillChar=' '>
    //                     <yjoin pad={[3, 6]} bg={5} fg={3}>
    //                         Hello world!
    //                     </yjoin>
    //                 </yjoin>
    //             </yjoin>
    //         </zjoin>
    //     </yjoin>
    // );
    const [stuff, setStuff] = useState('');
    const paraElm = useRef(null);
    useKeyboard((v) => console.log(v));
    return (_jsxs("zjoin", { children: [_jsx("input", { autofocus: true, multiline: true, onScroll: (sD) => {
                    paraElm.current.attributes.pad = [-sD[0], 0, 0, -sD[1]];
                }, onChange: (txt) => { setStuff(txt); }, fillChar: '\\x09', visible: false }), _jsx("cont", { fillChar: '.', children: _jsx("para", { flexGrow: true, ref: paraElm, children: stuff }) })] }));
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
            return;
        }
    }
    _read(size) {
        return this.destinationStream.read(size);
    }
}
wss.on('connection', function connection(ws) {
    const bridge = new DuplexBridge(createWebSocketStream(ws, { decodeStrings: false }), ws, { decodeStrings: false });
    const minitel = new Minitel(bridge, { statusBar: false });
    // ws.on('message', (data) => console.log({ data }));
    const derender = render(_jsx(App, {}), minitel);
    ws.on('close', () => {
        minitel.stream = new Duplex();
        derender();
        console.log('AYO');
    });
});
wss.on('error', () => { });
wss.on('listening', () => console.log('I exist!')); //
